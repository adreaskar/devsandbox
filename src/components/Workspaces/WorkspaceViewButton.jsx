'use client';

import React, { useContext } from 'react';
import { WorkspaceViewContext } from '@/context/WorkspaceView';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

function WorkspaceViewButton() {
    const { view, setView } = useContext(WorkspaceViewContext);

    return (

        <div className="flex items-center gap-1 p-1 glass-card rounded-lg">
            <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
            >
                <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
            >
                <List className="w-4 h-4" />
            </Button>
        </div>

    );
}

export default WorkspaceViewButton;