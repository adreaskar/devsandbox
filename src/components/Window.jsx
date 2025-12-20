import { cn } from "@/lib/utils";

function Window({ children, title, className }) {
    return (
        <div className={className}>
            <div className="border-dashed border bg-card rounded-md">
                <div className="border-b border-dashed px-6 py-3 flex justify-between">
                    <h2 className="text-2xl">{title}</h2>
                    <span className="size-2 rounded-full bg-accent my-auto" />
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Window;