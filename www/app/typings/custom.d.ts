
declare module custom {
	interface FileEventTarget extends EventTarget {
	    files: Array<File>
	}
}

