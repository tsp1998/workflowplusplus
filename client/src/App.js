import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

//styles
import './App.css';

//pages
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import IssuePage from './pages/IssuePage'
import AuthSuccessPage from './pages/AuthSuccessPage'
import ErrorPage from './pages/ErrorPage'

//components
import Header from './components/Header'

//constants


function App() {

    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken') || ''
        if (accessToken) {
            setIsLogged(true)
        }
    }, [])

    return (
        <div className="App" >
            <Router >
                <Header isLogged={isLogged} setIsLogged={setIsLogged} />
                <Route exact path="/" render={props => <IndexPage {...props} isLogged={isLogged} />} />
                <Route path="/login" component={LoginPage} />
                <Route path="/issue/:issueId" component={IssuePage} />
                <Route path="/auth-success" render={props => <AuthSuccessPage {...props} setIsLogged={setIsLogged} />} />
                <Route path="/error-page" component={ErrorPage} />
            </Router>
        </div>
    );
}

export default App;