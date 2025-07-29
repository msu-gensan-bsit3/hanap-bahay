import { getContext, setContext } from "svelte";
import type { LayoutData } from "../../routes/(agent)/$types";

const key = "agentData";

export function setAgentContext(data: LayoutData) {
	setContext(key, data);
}
export function getAgentContext() {
	return getContext(key) as LayoutData;
}
