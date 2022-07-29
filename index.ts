import * as pulumi from "@pulumi/pulumi";
import * as render from "@cloudyskysoftware/pulumi-render";

import { services } from "@cloudyskysoftware/pulumi-render/types/input";

const staticSiteDetails: services.StaticSiteServiceDetailsArgs = {
    publishPath: "public",
};

const staticSite = new render.services.StaticSite("staticsite", {
    name: "My custom static site",
    ownerId: pulumi
        .output(render.owners.listOwners())
        .apply(
            (result) =>
                result.items.filter(
                    (i) => i.owner?.email === "pl@cloudysky.software"
                )[0].owner?.id || ""
        ),
    repo: "https://github.com/cloudy-sky-software/test-static-site",
    type: "static_site",
    autoDeploy: "no",
    branch: "main",
    serviceDetails: staticSiteDetails,
});

export const url = (
    staticSite.serviceDetails as services.StaticSiteServiceDetailsArgs
).url;
