import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Clock } from "lucide-react";

export const StatusBadge = ({ status, className }) => {
    const statusConfig = {
        running: {
            variant: "success",
            icon: Play,
            label: "Running",
        },
        paused: {
            variant: "warning",
            icon: Pause,
            label: "Paused",
        },
        stopped: {
            variant: "stopped",
            icon: Square,
            label: "Stopped",
        },
        starting: {
            variant: "info",
            icon: Clock,
            label: "Starting",
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={className}>
            <Icon className="w-3 h-3 mr-0.5" />
            {config.label}
        </Badge>
    );
};