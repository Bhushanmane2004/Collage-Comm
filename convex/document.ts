import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createHackathonGroup = mutation({
  args: {
    groupName: v.string(),
    description: v.optional(v.string()),
    creatorId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Creating group with args:", args); // Debugging log

    try {
      const groupId = await ctx.db.insert("groups", {
        groupName: args.groupName,
        description: args.description,
        creatorId: args.creatorId,
        status: "open",
        members: [args.creatorId],
        posts: [],
        createdAt: Date.now(),
        groupImage: undefined,
      });

      console.log("Group created successfully with ID:", groupId); // Debugging log
      return { success: true, groupId: groupId }; // Ensure you return groupId properly
    } catch (error) {
      console.error("Error creating group:", error); // Debugging log
      throw new Error("Failed to create group");
    }
  },
});
