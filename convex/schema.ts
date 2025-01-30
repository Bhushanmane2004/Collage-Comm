import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  groups: defineTable({
    groupName: v.string(),
    description: v.optional(v.string()),
    creatorId: v.string(),
    status: v.string(),
    members: v.array(v.string()),
    posts: v.array(v.id("posts")),
    createdAt: v.number(),
    groupImage: v.optional(v.string()),
  })
    .index("by_creator", ["creatorId"])
    .index("by_member", ["members"])
    .index("by_status", ["status"]),

  posts: defineTable({
    groupId: v.id("groups"),
    userId: v.string(),
    message: v.string(),
    createdAt: v.number(),
    type: v.string(),
    addedMembers: v.array(v.string()),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    groups: v.array(v.id("groups")),
    status: v.string(),
    profilePicture: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"]),
});
