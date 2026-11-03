# Separate deployment build from local verification

The owner's Vercel log for d4ab808 shows that Next.js compiled, type-checked and generated all pages successfully, including the contact server route. The failure followed Vercel's onBuildComplete hook, when the package build command invoked prepare-verification-output.mjs. That local QA helper assumes raw homepage/404 files are still in .next/server/app; those files were unavailable in the hosted build layout.

The deployment command now runs only next build. The new build:verify command runs the same production build followed by the strict local snapshot helper. This removes the local file-layout assumption from deployment without swallowing errors, changing framework output, enabling static export or removing the contact endpoint. README distinguishes the two commands and records Vercel/default-output and server environment setup.

Regression evidence: a portable fixture stubs a successful framework build with incomplete raw prerendered HTML after adapter processing, then executes the actual package build script. Before the fix, it failed with exactly the owner's “Build is missing prerendered homepage or 404 HTML” error. Afterward it passes and does not create the local out snapshot. This is a simulated host-output boundary, not an actual Vercel build.

Fresh checks: build:verify successfully ran next build and generated the 17-page local snapshot; 136 Vitest and 6 Node tests passed; the static checker reported 17 HTML pages, 13 project pages and zero errors. No real email was sent. Actual hosted deployment and production email configuration still require Vercel's build and runtime checks.

References: installed Next.js deploying/adapter guides and https://vercel.com/docs/builds/configure-a-build. Keep the Next.js framework output default; out is for local verification only. Deployment secrets stay outside Git. The failed log identifies an old commit: use the new main revision when retrying deployment.
