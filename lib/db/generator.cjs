#!/usr/bin/env node
/* eslint-disable */

const { generatorHandler } = require("@prisma/generator-helper");
const fs = require("fs/promises");
const path = require("path");

function toFirstLetterLowerCase(str) {
  const [firstLetter, ...rest] = [...str];
  return [firstLetter.toLowerCase(), ...rest].join("");
}
function toFirstLetterUpperCase(str) {
  const [firstLetter, ...rest] = [...str];
  return [firstLetter.toUpperCase(), ...rest].join("");
}

function createDataType(modelName) {
  return [
    `type ${modelName}Data = Required<Parameters<typeof prisma.${toFirstLetterLowerCase(
      modelName,
    )}.create>[0]>["data"];`,
    `type ${modelName}SaveOptions = Omit<Parameters<typeof prisma.${toFirstLetterLowerCase(
      modelName,
    )}.create>[0], 'data'>;`,
  ].join("\n");
}

// kind: FieldKind;
// name: string;
// isRequired: boolean;
// isList: boolean;
// isUnique: boolean;
// isId: boolean;
// isReadOnly: boolean;
// isGenerated?: boolean;
// isUpdatedAt?: boolean;
// /**
//   * Describes the data type in the same the way it is defined in the Prisma schema:
//   * BigInt, Boolean, Bytes, DateTime, Decimal, Float, Int, JSON, String, $ModelName
//   */
// type: string;
// dbName?: string | null;
// hasDefaultValue: boolean;
// default?: FieldDefault | FieldDefaultScalar | FieldDefaultScalar[];
// relationFromFields?: string[];
// relationToFields?: string[];
// relationOnDelete?: string;
// relationName?: string;
// documentation?: string;
function generatePublicMethods(modelName, fields) {
  const modelNameLower = toFirstLetterLowerCase(modelName);
  return [
    fields
      .filter((field) => !field.isId)
      .map((field) => `   ${field.name}: ${modelName}Data["${field.name}"];`)
      .join("\n"),
    `   save(options: ${modelName}SaveOptions) {`,
    `     return prisma.${modelNameLower}.create({`,
    `       data: {`,
    fields
      .filter((field) => !field.isId)
      .map((field) => `         ${field.name}: this.${field.name},`)
      .join("\n"),
    `       },`,
    `       ...options`,
    `     })`,
    `   }`,
  ];
}

function generateStaticMethods(modelName) {
  return [
    `   static aggregate = wrap(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.aggregate);`,
    `   static count = wrap(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.count);`,
    `   static findFirst = wrap(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.findFirst);`,
    `   static findMany = wrap(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.findMany);`,
    `   static findUnique = wrap(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.findUnique);`,
    `   static groupBy = wrap(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.groupBy);`,
    `   static create = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.create);`,
    `   static createMany = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.createMany);`,
    `   static delete = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.delete);`,
    `   static deleteMany = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.deleteMany);`,
    `   static update = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.update);`,
    `   static updateMany = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.updateMany);`,
    `   static upsert = wrapMutation(prisma.${toFirstLetterLowerCase(
      modelName,
    )}.upsert);`,
  ];
}

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

    const modelDataTypes = options.dmmf.datamodel.models.map((model) => {
      return createDataType(model.name);
    });

    const models = options.dmmf.datamodel.models.map((model) => {
      const modelName = toFirstLetterLowerCase(model.name);
      model.fields;
      return [
        ` ${modelName}: class extends BaseModel {`,
        generatePublicMethods(model.name, model.fields).join("\n"),
        generateStaticMethods(modelName).join("\n"),
        ` },`,
      ].join("\n");
    });

    const output = [
      `import { prisma } from "@/db/orm";`,
      `import { BaseModel, wrap, wrapMutation } from "./BaseModel";`,
      modelDataTypes.join("\n"),
      `export const Model = {`,
      models.join("\n"),
      `}`,
    ].join("\n\n");

    await fs.writeFile(
      path.join(__dirname, "models.json"),
      JSON.stringify(options.dmmf.datamodel.models),
    );
    await fs.writeFile(path.join(__dirname, "Model.ts"), output);
  },
});
