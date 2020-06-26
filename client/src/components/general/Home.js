import React from 'react'
//import Grid from '@material-ui/core/Grid'
import Layout from './Layout'

function Home(props) {
    const change = localStorage.getItem('token')
    return (
        <div>
            {
                change ? 
                    <h1>Welcome to ChatBot</h1>
                :
                    <Layout/>
            }
        </div>
    )
}

export default Home