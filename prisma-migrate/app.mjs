import { execFile } from "child_process";
import path from "path";

export const lambdaHandler = async (event, context) => {
  try {
    const exitCode = await new Promise((resolve, _) => {
      execFile(
        path.resolve("./node_modules/prisma/build/index.js"),
        ["migrate", "deploy"],
        {
          env: {
            ...process.env,
          },
        },
        (error, stdout, stderr) => {
          console.log(stdout);
          if (error != null) {
            console.log(`prisma migrate deploy exited with error ${error.message}`);
            resolve(error.code ?? 1);
          } else {
            resolve(0);
          }
        },
      );
    });

    if (exitCode != 0) throw Error(`migration failed with exit code ${exitCode}`);
  } catch (e) {
    console.log(e);
    throw e;
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Finish! Status: ${exitCode}`,
    })
  };
};
  