#!/usr/bin/env node

const { generatorHandler } = require("@prisma/generator-helper");
const fs = require("fs/promises");
const path = require("path");

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "./models",
      prettyName: "Gemijs Models",
    };
  },
  async onGenerate(options) {
    const { config } = options.generator;
    const includeRelationFields =
      config.includeRelationFields === "false" ? false : true;

    const output = JSON.stringify(options.dmmf.datamodel.models);

    await fs.writeFile(path.join(__dirname, "models.ts"), output);
  },
});
