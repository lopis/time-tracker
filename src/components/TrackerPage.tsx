import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { makeStyles, createStyles } from '@material-ui/styles'
import { withStyles } from "@material-ui/core/styles"
import { TextField, Theme, List, ListItem, ListItemIcon, ListItemText, Box, Chip, Typography } from '@material-ui/core'
import { Timer as TimerIcon } from '@material-ui/icons'
import storageProvider, { Project, Entry, EntryType } from './provider/storageProvider';

const styles = (theme: Theme) => createStyles({
  button: {
		minWidth: '10em',
		marginLeft: theme.spacing(2),
	},
	appBar: {
		padding: '1em',
	},
	input: {
		fontSize: 'inherit',
		flexGrow: 1,
	},
	list: {
		maxWidth: 980,
		margin: 'auto'
	},
	listItem: {
		borderBottom: '1px solid #ddd'
	},
	toolbar: {
		display: 'flex',
	},
	duration: {
		flexGrow: 0,
		borderLeft: '1px solid #ddd',
		padding: `0 ${theme.spacing(2)}px`,
		fontSize: '110%'
	},
	time: {
		flexGrow: 0,
		borderLeft: '1px solid #ddd',
		padding: `0 ${theme.spacing(2)}px`,
		color: '#666',
		fontSize: '80%'
	}
})

interface IState {
	description: string,
	timeElapsed: number
}
type StateKeys = keyof IState

interface IProps {
	classes: any,
	projects: Project[],
	entries: Entry[],
	isRunning: boolean,
	addTimeEntry: (entry: Entry) => void
	addProject: (entry: Project) => void
}

class TrackerPage extends React.PureComponent<IProps, IState> {
	constructor (props) {
		super(props)

		this.state = {
			description: '',
			timeElapsed: 0
		}
	}

	componentDidMount = () => {
		setInterval(() => {
			const {entries, isRunning} = this.props
			if (!isRunning || entries.length === 0) {
				return
			}

			const last = entries[entries.length - 1]
			const time = Date.now() - Date.parse(last.timeStart)

			this.setState({
				timeElapsed: time
			})
		}, 1000)
	}

	toggleTracker = () => {
		const newEntry: Entry = {
			label: this.state.description,
			type: this.props.isRunning ? EntryType.END : EntryType.START
		}
		if (this.props.isRunning) {
			newEntry.timeEnd = (new Date()).toISOString()
			this.setState({
				description: ''
			})
		} else {
			newEntry.timeStart = (new Date()).toISOString()
		}

		this.props.addTimeEntry(newEntry)
	}

	handleChange = (name: StateKeys) => event => {
		const value = event.target.value
    this.setState((prevState) => ({
			...prevState,
			[name]: value
		}))
	}
	
	formattedDate = (timestamp: string) => {
		if (!timestamp) return null
		const date = new Date(timestamp)

		return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	}

	pad = (value: number) => {
		return `00${value}`.slice(-2)
	}

	formattedDuration = (time: number) => {
		if (!time) return null

		const HOURS   = 1000*60*60
		const MINUTES = 1000*60
		const SECONDS = 1000
		const hours   = Math.floor(time / HOURS)
		const minutes = Math.floor((time - (hours * HOURS)) / MINUTES)
		const seconds = Math.floor((time - (hours * HOURS) - (minutes * MINUTES)) / SECONDS)

		return hours
			? `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
			: `${this.pad(minutes)}:${this.pad(seconds)}`
	}

	render () {
		const {description, timeElapsed=0} = this.state
		const {classes, projects, entries, isRunning} = this.props

		return <div>
			<AppBar className={classes.appBar} color="default">
				<Toolbar className={classes.toolbar}>
					<TextField
						id="description"
						className={classes.input}
						label="Task Description"
						value={description}
						onChange={this.handleChange('description')}
						variant="outlined"
					/>
					<Button onClick={this.toggleTracker}
						className={classes.button}
						variant="contained"
						size="large"
						disabled={isRunning && description.length < 1}
						color={isRunning ? 'secondary' : 'primary'}>
						{isRunning ? this.formattedDuration(timeElapsed) : 'Start'}
					</Button>
				</Toolbar>
			</AppBar>
			<Box mt={12}>
				<List className={classes.list}>
					{entries.map(({label, timeStart, timeEnd, duration}, _index) => (
						<ListItem key={_index} className={classes.listItem}>
							<ListItemIcon>
								<TimerIcon />
							</ListItemIcon>
							<ListItemText primary={label} />
							<ListItemText
								className={classes.time}>
								<small>{[
									this.formattedDate(timeStart),
									this.formattedDate(timeEnd)
								].filter(d => d).join(' - ')}</small>
							</ListItemText>
							<ListItemText className={classes.duration}>
								{this.formattedDuration(duration || timeElapsed)}
							</ListItemText>
						</ListItem>
					))}
				</List>
			</Box>
		</div>
	}
}

export default withStyles(styles)(
	storageProvider(TrackerPage)
)