<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";

	interface Task {
		id: number;
		task: string;
		time: string;
		completed: boolean;
	}

	let { tasks }: { tasks: Task[] } = $props();

	function toggleTask(taskId: number) {
		tasks = tasks.map((task) =>
			task.id === taskId ? { ...task, completed: !task.completed } : task,
		);
	}
</script>

<Card>
	<CardHeader class="flex flex-row items-center justify-between">
		<CardTitle>Today's Tasks</CardTitle>
		<Button size="sm" variant="outline">
			<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</Button>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			{#each tasks as task}
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						checked={task.completed}
						onchange={() => toggleTask(task.id)}
						class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
					/>
					<div class="flex-1">
						<p
							class="text-sm font-medium
                {task.completed ? 'text-gray-400 line-through' : 'text-black'}"
						>
							{task.task}
						</p>
						<p class="text-xs {task.completed ? 'text-gray-400' : 'text-black'}">
							{task.time}
						</p>
					</div>
				</div>
			{/each}
		</div>
		<button class="mt-4 text-xs text-blue-600 hover:underline">View all tasks</button>
	</CardContent>
</Card>
