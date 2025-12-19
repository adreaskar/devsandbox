'use client'

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WorkspaceCard from "@/components/Workspaces/WorkspaceCard";
import { WorkspaceViewContext } from '@/context/WorkspaceView';
import Image from 'next/image';

function WorkspaceGrid({ workspaces }) {
    const router = useRouter();
    const { view } = useContext(WorkspaceViewContext);

    useEffect(() => {
        console.log("🔌 Workspace Grid listening for updates...");
        const eventSource = new EventSource('/api/docker-events');

        eventSource.onmessage = (event) => {
            console.log("⚡ Change detected. Refreshing list...");
            router.refresh();
        };

        return () => {
            eventSource.close();
        };
    }, [router]);

    if (!workspaces || workspaces.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p className='font-mono'>No workspaces found. Create one to get started!</p>
                <div className="mt-6 flex justify-center">
                    <Image
                        src="/img/workspace.png"
                        alt="No Workspaces"
                        width={150}
                        height={100}
                        className="opacity-40 mt-5"
                    />
                </div>
            </div>
        );
    }

    return (

        <div
            className={
                view === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
            }
        >
            {workspaces.map((workspace) => (
                <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
        </div>

    );
}

export default WorkspaceGrid;