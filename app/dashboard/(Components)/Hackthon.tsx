import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Users,
  Calendar as CalendarIcon2,
  UserPlus,
  Settings,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast, Toaster } from "sonner";

function HomeDash() {
  const { user } = useUser();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [maxMembers, setMaxMembers] = useState<number>(4);
  const [creatorId, setCreatorId] = useState<string>("");
  const [showRequests, setShowRequests] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "my">("all");

  const create = useMutation(api.document.createHackathonGroup);
  const hackathons = useQuery(api.document.getAllOngoingHackathons);
  const myHackathons = useQuery(api.document.getMyCreatedHackathons, {
    userId: creatorId,
  });
  const approveRequest = useMutation(api.document.approveGroupRequest);
  const requestToJoin = useMutation(api.document.requestToJoinGroup);

  useEffect(() => {
    if (user) {
      setCreatorId(user.username || "defaultUsername");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName || !description || !date) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const result = await create({
        groupName,
        description,
        creatorId,
        maxMembers,
      });

      if (result && result.success) {
        toast.success("Hackathon created successfully!");
        setGroupName("");
        setDescription("");
        setDate(undefined);
        setMaxMembers(4);
      } else {
        toast.error("Failed to create hackathon.");
      }
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleApproveRequest = async (groupId: string, userId: string) => {
    try {
      await approveRequest({
        groupId,
        userId,
        creatorId,
      });
      toast.success("Member approved successfully!");
    } catch (error) {
      toast.error("Failed to approve member");
    }
  };

  const handleJoinRequest = async (groupId: string) => {
    try {
      await requestToJoin({
        groupId,
        userId: creatorId,
      });
      toast.success("Join request sent!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send request"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-center" richColors />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Hackathons
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CalendarIcon className="h-4 w-4" />
              Create Hackathon
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create New Hackathon
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                Set up your hackathon event and invite participants.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Hackathon Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full rounded-lg"
                required
              />
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg"
                required
              />
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Max Members"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  min={2}
                  max={10}
                  className="w-1/2 rounded-lg"
                  required
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-1/2 justify-start text-left font-normal rounded-lg",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-lg"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate: Date | undefined) => setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                disabled={!groupName || !description || !date}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
              >
                Create Hackathon
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-4 mb-8">
        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          onClick={() => setViewMode("all")}
          className={`rounded-full px-6 transition-all ${
            viewMode === "all"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          All Hackathons
        </Button>
        <Button
          variant={viewMode === "my" ? "default" : "outline"}
          onClick={() => setViewMode("my")}
          className={`rounded-full px-6 transition-all ${
            viewMode === "my"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          My Hackathons
        </Button>
      </div>

      {/* Content Section */}
      {viewMode === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons?.success ? (
            hackathons.hackathons.length > 0 ? (
              hackathons.hackathons.map((hackathon) => (
                <div
                  key={hackathon._id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300" />

                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                          {hackathon.groupName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {hackathon.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4" />
                        <span>
                          {hackathon.memberCount}/{hackathon.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <CalendarIcon2 className="h-4 w-4" />
                        <span>
                          {format(new Date(hackathon.createdAt), "PP")}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {hackathon.creatorId !== creatorId &&
                        !hackathon.approvedMembers?.includes(creatorId) && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                            onClick={() => handleJoinRequest(hackathon._id)}
                            disabled={
                              hackathon.memberCount >= hackathon.maxMembers ||
                              hackathon.pendingMembers?.includes(creatorId)
                            }
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {hackathon.pendingMembers?.includes(creatorId)
                              ? "Request Pending"
                              : "Join Hackathon"}
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                    No ongoing hackathons available.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500">
                    Create one to get started!
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
                <p className="text-red-600 dark:text-red-400">
                  Error fetching hackathons.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myHackathons?.success ? (
            myHackathons.myHackathons.length > 0 ? (
              myHackathons.myHackathons.map((hackathon) => (
                <div
                  key={hackathon._id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300" />

                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                          {hackathon.groupName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {hackathon.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setShowRequests(!showRequests)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4" />
                        <span>
                          {hackathon.memberCount}/{hackathon.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        <CalendarIcon2 className="h-4 w-4" />
                        <span>
                          {format(new Date(hackathon.createdAt), "PP")}
                        </span>
                      </div>
                    </div>

                    {showRequests &&
                      hackathon.pendingMembers &&
                      hackathon.pendingMembers.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                            Pending Requests
                          </h4>
                          {hackathon.pendingMembers.map((userId) => (
                            <div
                              key={userId}
                              className="flex items-center justify-between py-1"
                            >
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {userId}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleApproveRequest(hackathon._id, userId)
                                }
                                className="rounded-lg"
                              >
                                Approve
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                    You haven't created any hackathons yet.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500">
                    Create your first hackathon using the button above!
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
                <p className="text-red-600 dark:text-red-400">
                  Error fetching your hackathons.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeDash;
