import * as React from 'react'

interface IState {
	projects?: Project[]
	entries?: Entry[]
	isReady: boolean
	isRunning: boolean
}

export type Project = {
	name: string
}

export enum EntryType {
	START = 0,
	END = 1,
} 

export type Entry = {
	label: string
	timeStart?: string
	timeEnd?: string
	duration?: number
	type: EntryType
}


export default function storageProvider (WrappedComponent) {
	return class extends React.Component<{}, IState> {
		constructor (props) {
			super(props)

			this.state = {
				isReady: false,
				isRunning: false,
			}
		}

		componentDidMount () {
			const projects = JSON.parse(localStorage.getItem('projects')) || []
			const entries = JSON.parse(localStorage.getItem('entries')) || []

			if (projects && !Array.isArray(projects) || entries && !Array.isArray(entries)) {
				throw 'Data format exception: storage is not undefined or array.'
			}

			const isRunning = entries.length > 0
				&& entries[entries.length -1].type === EntryType.START

			this.setState({
				projects: projects,
				entries: entries,
				isRunning: isRunning,
				isReady: true,
			})
		}

		setStore = (entries?: Entry[], projects?: Project[]) => {
			if (projects) {
				localStorage.setItem('projects', JSON.stringify(projects))
			}
			if (entries) {
				localStorage.setItem('entries', JSON.stringify(entries))
			}
		}

		addProject = (project: Project) => {
			this.setState(({projects}) => ({
				projects: projects.concat([project]),
			}), () => {
				localStorage.setItem('projects', JSON.stringify(this.state.projects))
			})
		}

		addTimeEntry = (entry: Entry) => {
			this.setState((state) => {
				if (entry.type === EntryType.END) {
					const entries = [...state.entries]
					const last = {
						...entries.pop(),
						...entry,
					}

					const end = Date.parse(last.timeEnd)
					const begin = Date.parse(last.timeStart)
					
					last.duration = end - begin
					
					entries.push({
						...last,
						...entry,
					})

					return {
						...state,
						entries: entries,
						isRunning: false
					}
				} else {
					return {
						...state,
						entries: state.entries.concat([entry]),
						isRunning: true
					}
				}
			}, () => {
				localStorage.setItem('entries', JSON.stringify(this.state.entries))
			})
		}

		render () {
			const {isReady, ...rest} = this.state

			return isReady
				? <WrappedComponent {...rest} {...this.props}
					addProject={this.addProject}
					addTimeEntry={this.addTimeEntry}/>
				: null
		}
	}
}
