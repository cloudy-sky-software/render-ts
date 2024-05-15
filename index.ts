import * as pulumi from "@pulumi/pulumi";
import * as render from "@cloudyskysoftware/pulumi-render";

import { services as servicesInputs } from "@cloudyskysoftware/pulumi-render/types/input";
import { services as servicesOutputs } from "@cloudyskysoftware/pulumi-render/types/output";

const ownerId = pulumi
    .output(render.owners.listOwners())
    .apply(
        (result) =>
            result.items.filter(
                (i) => i.owner?.email === "pl@cloudysky.software"
            )[0].owner?.id || ""
    );

const staticSiteDetails: servicesInputs.StaticSiteDetailsCreateArgs = {
    publishPath: "public",
};

const staticSite = new render.services.Service("staticsite", {
    name: "My custom static site",
    ownerId,
    repo: "https://github.com/cloudy-sky-software/test-static-site",
    autoDeploy: "no",
    branch: "main",
    serviceDetails: staticSiteDetails,
    type: "static_site",
});

const port = "8080";

const webServiceDetails: servicesInputs.WebServiceDetailsCreateArgs = {
    env: "node",
    plan: "starter",
    region: "oregon",
    envSpecificDetails: {
        buildCommand: "yarn",
        startCommand: "node app.js",
    },
};

const webService = new render.services.Service("webservice", {
    name: "An Express.js web service",
    ownerId,
    repo: "https://github.com/render-examples/express-hello-world",
    autoDeploy: "yes",
    envVars: [
        {
            key: "PORT",
            value: port,
        },
    ],
    branch: "master",
    serviceDetails: webServiceDetails,
    type: "web_service",
});

export const url = staticSite.serviceDetails.apply(
    (s) => s as servicesOutputs.StaticSiteDetails
).url;

export const webServiceUrl = webService.serviceDetails.apply(
    (s) => s as servicesOutputs.WebServiceDetails
).url;
