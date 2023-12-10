import { prisma } from "@/db/orm";

import { BaseModel, wrap, wrapMutation } from "./BaseModel";

type OrganizationData = Required<Parameters<typeof prisma.organization.create>[0]>["data"];
type OrganizationSaveOptions = Omit<Parameters<typeof prisma.organization.create>[0], 'data'>;
type MembershipData = Required<Parameters<typeof prisma.membership.create>[0]>["data"];
type MembershipSaveOptions = Omit<Parameters<typeof prisma.membership.create>[0], 'data'>;
type UserData = Required<Parameters<typeof prisma.user.create>[0]>["data"];
type UserSaveOptions = Omit<Parameters<typeof prisma.user.create>[0], 'data'>;
type VerificationTokenData = Required<Parameters<typeof prisma.verificationToken.create>[0]>["data"];
type VerificationTokenSaveOptions = Omit<Parameters<typeof prisma.verificationToken.create>[0], 'data'>;

export const Model = {

 organization: class extends BaseModel {
   name: OrganizationData["name"];
   membership: OrganizationData["membership"];
   save(options: OrganizationSaveOptions) {
     return prisma.organization.create({
       data: {
         name: this.name,
         membership: this.membership,
       },
       ...options
     })
   }
   static aggregate = wrap(prisma.organization.aggregate);
   static count = wrap(prisma.organization.count);
   static findFirst = wrap(prisma.organization.findFirst);
   static findMany = wrap(prisma.organization.findMany);
   static findUnique = wrap(prisma.organization.findUnique);
   static groupBy = wrap(prisma.organization.groupBy);
   static create = wrapMutation(prisma.organization.create);
   static createMany = wrapMutation(prisma.organization.createMany);
   static delete = wrapMutation(prisma.organization.delete);
   static deleteMany = wrapMutation(prisma.organization.deleteMany);
   static update = wrapMutation(prisma.organization.update);
   static updateMany = wrapMutation(prisma.organization.updateMany);
   static upsert = wrapMutation(prisma.organization.upsert);
 },
 membership: class extends BaseModel {
   role: MembershipData["role"];
   organization: MembershipData["organization"];
   organizationId: MembershipData["organizationId"];
   user: MembershipData["user"];
   userId: MembershipData["userId"];
   invitedName: MembershipData["invitedName"];
   invitedEmail: MembershipData["invitedEmail"];
   save(options: MembershipSaveOptions) {
     return prisma.membership.create({
       data: {
         role: this.role,
         organization: this.organization,
         organizationId: this.organizationId,
         user: this.user,
         userId: this.userId,
         invitedName: this.invitedName,
         invitedEmail: this.invitedEmail,
       },
       ...options
     })
   }
   static aggregate = wrap(prisma.membership.aggregate);
   static count = wrap(prisma.membership.count);
   static findFirst = wrap(prisma.membership.findFirst);
   static findMany = wrap(prisma.membership.findMany);
   static findUnique = wrap(prisma.membership.findUnique);
   static groupBy = wrap(prisma.membership.groupBy);
   static create = wrapMutation(prisma.membership.create);
   static createMany = wrapMutation(prisma.membership.createMany);
   static delete = wrapMutation(prisma.membership.delete);
   static deleteMany = wrapMutation(prisma.membership.deleteMany);
   static update = wrapMutation(prisma.membership.update);
   static updateMany = wrapMutation(prisma.membership.updateMany);
   static upsert = wrapMutation(prisma.membership.upsert);
 },
 user: class extends BaseModel {
   createdAt: UserData["createdAt"];
   updatedAt: UserData["updatedAt"];
   name: UserData["name"];
   email: UserData["email"];
   role: UserData["role"];
   membership: UserData["membership"];
   save(options: UserSaveOptions) {
     return prisma.user.create({
       data: {
         createdAt: this.createdAt,
         updatedAt: this.updatedAt,
         name: this.name,
         email: this.email,
         role: this.role,
         membership: this.membership,
       },
       ...options
     })
   }
   static aggregate = wrap(prisma.user.aggregate);
   static count = wrap(prisma.user.count);
   static findFirst = wrap(prisma.user.findFirst);
   static findMany = wrap(prisma.user.findMany);
   static findUnique = wrap(prisma.user.findUnique);
   static groupBy = wrap(prisma.user.groupBy);
   static create = wrapMutation(prisma.user.create);
   static createMany = wrapMutation(prisma.user.createMany);
   static delete = wrapMutation(prisma.user.delete);
   static deleteMany = wrapMutation(prisma.user.deleteMany);
   static update = wrapMutation(prisma.user.update);
   static updateMany = wrapMutation(prisma.user.updateMany);
   static upsert = wrapMutation(prisma.user.upsert);
 },
 verificationToken: class extends BaseModel {
   identifier: VerificationTokenData["identifier"];
   token: VerificationTokenData["token"];
   expires: VerificationTokenData["expires"];
   save(options: VerificationTokenSaveOptions) {
     return prisma.verificationToken.create({
       data: {
         identifier: this.identifier,
         token: this.token,
         expires: this.expires,
       },
       ...options
     })
   }
   static aggregate = wrap(prisma.verificationToken.aggregate);
   static count = wrap(prisma.verificationToken.count);
   static findFirst = wrap(prisma.verificationToken.findFirst);
   static findMany = wrap(prisma.verificationToken.findMany);
   static findUnique = wrap(prisma.verificationToken.findUnique);
   static groupBy = wrap(prisma.verificationToken.groupBy);
   static create = wrapMutation(prisma.verificationToken.create);
   static createMany = wrapMutation(prisma.verificationToken.createMany);
   static delete = wrapMutation(prisma.verificationToken.delete);
   static deleteMany = wrapMutation(prisma.verificationToken.deleteMany);
   static update = wrapMutation(prisma.verificationToken.update);
   static updateMany = wrapMutation(prisma.verificationToken.updateMany);
   static upsert = wrapMutation(prisma.verificationToken.upsert);
 },

}