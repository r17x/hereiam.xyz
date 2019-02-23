import React, { Component } from 'react'
import axios from 'axios'
import './index.css'
import './App.css'
import '_card.scss'

const { REACT_APP_NAME: APP_NAME } = process.env

class App extends Component {
  state = {
    result: {},
    PUBLICAPI: [
      'http://www.geoplugin.net/json.gp',
      'https://ipapi.co/json/',
      'http://ip-api.com/json',
    ],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const { result } = this.state

    const resultTemp = await Promise.all(
      this.state.PUBLICAPI.map(api => axios.get(api).then(({ data }) => data)),
    )

    this.state.PUBLICAPI.forEach((name, index) => {
      const uriName = new window.URL(name)
      Object.assign(result, { [uriName.hostname]: resultTemp[index] })
    })

    const description = result['ipapi.co']
      ? (result['ipapi.co'].city || '') +
        ', ' +
        (result['ipapi.co'].country_name || '')
      : ''

    this.setState({ result, description }, () => {
      document.title = APP_NAME + ' ~ ' + description
    })
  }

  renderList = () => {
    const { result } = this.state
    const Card = props => {
      const { data } = props
      return (
        <div className="card">
          <div className="card--cap green" />
          <div className="card--body">
            <h2 className="card--header green">{props.name}</h2>
            {data
              ? Object.keys(data).map((list, index) => {
                  if (
                    list.match(/credit/i) ||
                    [undefined, null, ''].includes(data[list])
                  )
                    return null
                  return (
                    <p key={index} style={{ textAlign: 'left' }}>
                      {String(list)
                        .replace(/[^a-zA-Z ]|geoplugin/g, ' ')
                        .toUpperCase()}
                      <strong>{data[list]}</strong>
                    </p>
                  )
                })
              : null}
          </div>
        </div>
      )
    }
    return (
      Object.keys(result).map(name => (
        <Card name={name} key={name} data={result[name]} />
      )) || null
    )
  }

  render() {
    const { description } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1>Here Are You!</h1>
          {description ? <p>{description}</p> : null}
          <div className="choose-test__wrapper">{this.renderList()}</div>
        </header>
      </div>
    )
  }
}

export default App
