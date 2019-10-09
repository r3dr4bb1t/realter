
import React from "react"
import MapComponent from "../components/map/map"

class Map extends React.PureComponent {
    state = {
        data: [],
        intervalIsSet: false,
    }

    async componentDidMount() {
        if (this.state.data.length === 0)
            await this.getCordsFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }

    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    getCordsFromDb = async () => {
        try {
            const data = await fetch('http://localhost:3001/item')
            const jsonData = await data.json()
            this.setState({ data: jsonData.data })
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <MapComponent realEstates={this.state.data} />
        )
    }
}

export default Map