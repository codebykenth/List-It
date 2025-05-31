export interface Task {
    id?: number | null;
    user_id?: number | null;
    title: string;
    description: string;
    priority: string;
    category: string;
    due_date: Date;
    task_image?: File | null
    image_url?: string | ""; // Update to handle both string and File
    created_at?: Date | null;
    updated_at?: Date | null;
}