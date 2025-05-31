"use client";
import * as React from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";
import { authApiService } from "@/api/ApiService";
import { Button } from "@/components/ui/button";
import type { User } from "@/models/User.model.ts";
import type { Task } from "@/models/Task.model.ts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FileInput from "@/components/FileInput";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import "react-day-picker/style.css";

export default function Home() {
  const defaultClassNames = getDefaultClassNames();
  
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [formData, setFormData] = useState<Task>({
    id: 0,
    user_id: 0,
    title: "",
    description: "",
    due_date: today,
    priority: "",
    category: "",
    task_image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started", formData); // Debug log

    if (!formData.title || !formData.description || !formData.due_date) {
      console.log("Validation failed", { formData }); // Debug log
      setError("Please fill in all required fields");
      return;
    }

    submitForm();
  };

  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedCategory = e.target.value;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     category: selectedCategory,
  //   }));
  // };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      console.log("Creating FormData");
      const formDataToSend = new FormData();

      const formattedDate = format(formData.due_date, "yyyy-MM-dd HH:mm:ss");

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("due_date", formattedDate);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("category", formData.category);

      if (formData.task_image instanceof File) {
        formDataToSend.append(
          "task_image",
          formData.task_image,
          formData.task_image.name
        );
      }

      const response = await authApiService.postData("/tasks", formDataToSend);
      console.log("API response:", response);

      // Reset form
      setFormData({
        id: 0,
        user_id: 0,
        title: "",
        description: "",
        due_date: today,
        priority: "",
        category: "",
        task_image: null,
      });

      setSelectedDateTime(null);
      setIsAddTaskOpen(false); // Close the dialog
      await fetchTasksData(currentPage); // Refresh tasks list
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      let errorMessage = "Failed to submit form";

      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      }

      if (error && typeof error === "object" && "response" in error) {
        const errorObj = error as ErrorResponse;
        const response = errorObj.response?.data;
        if (response?.errors) {
          errorMessage = Object.entries(response.errors)
            .map(([key, msgs]) => `${key}: ${msgs.join(", ")}`)
            .join("; ");
        } else if (response?.message) {
          errorMessage = response.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("Selected file:", file); // Debug log
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        task_image: file,
      }));
    }
  };

  const handleDateTimeSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Set default time to current time when date is selected
      const now = new Date();
      const dateWithTime = set(selectedDate, {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: 0,
      });
      setSelectedDateTime(dateWithTime);

      setFormData((prevData) => ({
        ...prevData,
        due_date: dateWithTime,
      }));
    } else {
      setSelectedDateTime(null);
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDateTime) {
      const [hours, minutes] = e.target.value.split(":");
      const newDateTime = set(selectedDateTime, {
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        seconds: 0,
      });
      setSelectedDateTime(newDateTime);

      setFormData((prevData) => ({
        ...prevData,
        due_date: newDateTime,
      }));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authApiService.getData("/profile");

        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Fetch error:", error); // Debug error
        setError(`Failed to fetch user data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchTasksData = async (page: number = 1) => {
    try {
      setTasksLoading(true);
      const response = await authApiService.getData(`/tasks?page=${page}`);

      if (response) {
        setTasks(response.data);
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setTasksError(`Failed to fetch task data: ${error}`);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData(currentPage);
  }, [currentPage]);

  const handleTaskClick = async (taskId: number) => {
    try {
      setIsLoading(true);
      const response = await authApiService.getData(`/tasks/${taskId}`);
      setSelectedTask(response);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      setIsUpdating(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", selectedTask.title);
      formDataToSend.append("description", selectedTask.description);
      formDataToSend.append(
        "due_date",
        format(new Date(selectedTask.due_date), "yyyy-MM-dd HH:mm:ss")
      );
      formDataToSend.append("priority", selectedTask.priority);
      formDataToSend.append("category", selectedTask.category);

      if (selectedTask.task_image instanceof File) {
        formDataToSend.append(
          "task_image",
          selectedTask.task_image,
          selectedTask.task_image.name
        );
      }
      await authApiService.postData(
        `/tasks/${selectedTask.id}/update`,
        formDataToSend
      );
      await fetchTasksData(currentPage);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      setIsDeleting(true);
      await authApiService.deleteData(`/tasks/${selectedTask.id}`);
      await fetchTasksData(currentPage);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriorityFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPriority(e.target.value);
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const matchesCategory =
        !selectedCategory || task.category === selectedCategory;
      const matchesPriority =
        !selectedPriority || task.priority === selectedPriority;
      return matchesCategory && matchesPriority;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <Header name={user?.name} photoUrl={user?.profile_image_url || null} />
      <div className="bg-slate-200 p-4 space-y-2">
        <div className=" w-full flex justify-between">
          <label htmlFor="" className="w-1/3">
            Category
          </label>
          <select
            name="category"
            id=""
            className="w-2/3 cursor-pointer"
            value={selectedCategory}
            onChange={handleCategoryFilterChange}
          >
            <option value="">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health/Fitness">Health/Fitness</option>
            <option value="Shopping">Shopping</option>
            <option value="Home">Home</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Social">Social</option>
            <option value="Errands">Errands</option>
            <option value="Events">Events</option>
            <option value="Goals">Goals</option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="Family">Family</option>
            <option value="Projects">Projects</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Self-Care">Self-Care</option>
            <option value="Pets">Pets</option>
            <option value="Appointments">Appointments</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className=" w-full flex justify-between">
          <label htmlFor="" className="w-1/3">
            Priority
          </label>
          <select
            name="priority"
            id=""
            className="w-2/3 cursor-pointer"
            value={selectedPriority}
            onChange={handlePriorityFilterChange}
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* All Tasks */}
      {/* {!tasksLoading && !tasksError && tasks.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )} */}
      <div className="flex justify-between p-4">
        <h1 className="text-2xl">All Tasks</h1>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-slate-700 text-slate-200 cursor-pointer"
              onClick={() => setIsAddTaskOpen(true)}
            >
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
                <DialogDescription className="text-slate-700 mb-4">
                  Fill in the details below to add a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="title-1">Title</Label>
                  <Input
                    id="title-1"
                    type="text"
                    name="title"
                    placeholder="Learn"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description-1">Description</Label>
                  <Textarea
                    id="description-1"
                    name="description"
                    placeholder="I will learn programming."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        description: e.target.value,
                      }));
                    }}
                    className="min-h-[100px] resize-y"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDateTime && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDateTime ? (
                          format(selectedDateTime, "PPP HH:mm")
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-0">
                        <DayPicker
                          animate
                          mode="single"
                          selected={selectedDateTime ?? undefined}
                          onSelect={handleDateTimeSelect}
                          classNames={{
                            today: `border-slate-800 rounded-full`, // Add a border to today's date
                            selected: `bg-slate-800 border-amber-500 text-white rounded-full`, // Highlight the selected day
                            root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
                            chevron: `fill-slate-800 rounded-full` // Change the color of the chevron
                          }}
                          disabled={(date) => date < today}
                        />
                        {/* <Calendar
                          mode="single"
                          selected={selectedDateTime ?? undefined}
                          onSelect={handleDateTimeSelect}
                        /> */}
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            value={
                              formData.due_date
                                ? format(formData.due_date, "HH:mm")
                                : ""
                            }
                            onChange={handleDateTimeChange}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="priority-1">Priority</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("priority", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Category</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Health/Fitness">
                          Health/Fitness
                        </SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Hobbies">Hobbies</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Errands">Errands</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Goals">Goals</SelectItem>
                        <SelectItem value="Miscellaneous">
                          Miscellaneous
                        </SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Projects">Projects</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Self-Care">Self-Care</SelectItem>
                        <SelectItem value="Pets">Pets</SelectItem>
                        <SelectItem value="Appointments">
                          Appointments
                        </SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="task_image">Attachment (optional)</Label>
                  <FileInput
                    id="task_image"
                    name="task_image"
                    label="Upload an image (jpg, jpeg, png)"
                    accept="image/*,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    submitForm();
                  }}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mr-2"></span>
                      Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Tasks Display Section */}
      <div className="p-4">
        {tasksLoading ? (
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-slate-700">Loading tasks...</p>
          </div>
        ) : tasksError ? (
          <div className="text-red-700 italic">{tasksError}</div>
        ) : tasks.length === 0 ? (
          <p className="text-red-700 italic text-center">No tasks added</p>
        ) : (
          <>
            <div className="grid gap-4">
              {getFilteredTasks().map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id!)}
                  // className="bg-white rounded-lg shadow-md p-4 border border-slate-200"
                  className={`cursor-pointer rounded-lg shadow-md p-4 border border-slate-200 ${
                    task.priority === "High"
                      ? "bg-red-400"
                      : task.priority === "Medium"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <span className="text-sm text-slate-800">
                      Due: {format(new Date(task.due_date), "PPP HH:mm")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Task Details/Update Dialog  */}
            <Dialog
              open={selectedTask !== null}
              onOpenChange={(open) => !open && setSelectedTask(null)}
            >
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleUpdateTask}>
                  <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                    <DialogDescription>
                      View or update the task details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    <Label htmlFor="title-1">Title</Label>
                    <Input
                      id="title-1"
                      type="text"
                      name="title"
                      value={selectedTask?.title || ""}
                      onChange={(e) => {
                        setSelectedTask((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        );
                      }}
                    />
                  </div>
                  <div className="grid gap-2 pb-4">
                    <Label htmlFor="description-1">Description</Label>
                    <Textarea
                      id="description-1"
                      name="description"
                      value={selectedTask?.description || ""}
                      onChange={(e) => {
                        setSelectedTask((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        );
                      }}
                      className="min-h-[100px] resize-y"
                    />
                  </div>
                  <div className="grid gap-2 pb-4">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={selectedTask?.priority || ""}
                      onValueChange={(value) =>
                        setSelectedTask((prev) =>
                          prev ? { ...prev, priority: value } : null
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 pb-4">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedTask?.category || ""}
                      onValueChange={(value) =>
                        setSelectedTask((prev) =>
                          prev ? { ...prev, category: value } : null
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Hobbies">Hobbies</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Errands">Errands</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Goals">Goals</SelectItem>
                        <SelectItem value="Miscellaneous">
                          Miscellaneous
                        </SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Projects">Projects</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Self-Care">Self-Care</SelectItem>
                        <SelectItem value="Pets">Pets</SelectItem>
                        <SelectItem value="Appointments">
                          Appointments
                        </SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 pb-4">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedTask?.due_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedTask?.due_date ? (
                            format(new Date(selectedTask.due_date), "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            selectedTask?.due_date
                              ? new Date(selectedTask.due_date)
                              : undefined
                          }
                          onSelect={(date) =>
                            date &&
                            setSelectedTask((prev) =>
                              prev ? { ...prev, due_date: date } : null
                            )
                          }
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            value={
                              selectedTask?.due_date
                                ? format(
                                    new Date(selectedTask.due_date),
                                    "HH:mm"
                                  )
                                : ""
                            }
                            onChange={(e) => {
                              if (selectedTask?.due_date) {
                                const [hours, minutes] =
                                  e.target.value.split(":");
                                const newDate = set(
                                  new Date(selectedTask.due_date),
                                  {
                                    hours: parseInt(hours),
                                    minutes: parseInt(minutes),
                                  }
                                );
                                setSelectedTask((prev) =>
                                  prev ? { ...prev, due_date: newDate } : null
                                );
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2 pb-4">
                    <Label htmlFor="task_image"> Attachment</Label>
                    <FileInput
                      id="task_image"
                      accept="image/*,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedTask((prev) =>
                            prev ? { ...prev, task_image: file } : null
                          );
                        }
                      }}
                    />
                    {selectedTask?.image_url && (
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedTask.image_url}
                          alt="Task Attachment"
                          className="w-3xl h-3xl"
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      type="submit"
                      disabled={isUpdating || isDeleting}
                      variant="default"
                      onClick={handleDeleteTask}
                      className="cursor-pointer"
                    >
                      {isDeleting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mr-2"></span>
                          Deleting...
                        </>
                      ) : (
                        "Mark as done"
                      )}
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isUpdating || isDeleting}
                      className="cursor-pointer"
                    >
                      {isUpdating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mr-2"></span>
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="py-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
