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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast, Toaster } from "sonner";

function HomeDash() {
  const { user } = useUser();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [creatorId, setCreatorId] = useState<string>("");
  const [status, setStatus] = useState<{
    type: "error" | "success" | "loading" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const create = useMutation(api.document.createHackathonGroup);

  useEffect(() => {
    if (user) {
      console.log("User:", user.username);
      setCreatorId(user.username || "defaultUsername");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Creating group..." });

    if (!groupName || !description || !date || !creatorId) {
      setStatus({
        type: "error",
        message: "All fields are required.",
      });
      return;
    }

    try {
      const result = await create({
        groupName,
        description,
        creatorId,
      });

      console.log("Mutation result:", result);

      if (result && result.success) {
        toast.success("Event has been created");
        setStatus({ type: "success", message: "Group created successfully!" });
        setGroupName("");
        setDescription("");
        setDate(undefined);
      } else {
        setStatus({
          type: "error",
          message: "Failed to create group. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setStatus({
        type: "error",
        message: `Error creating group: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Hack</h1>
      <div className="absolute flex gap-3 top-3 right-16">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Create Hackathon</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create Hackathon Group</AlertDialogTitle>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate: Date | undefined) => setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                disabled={!groupName || !description || !date}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button>Existing Hackathon</Button>
      </div>
    </div>
  );
}

export default HomeDash;
