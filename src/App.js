import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import Expenses from "./pages/expensesList";
import Products from "./pages/productsList";
import Product from "./components/productEdit";

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/expenses" component={Expenses}></Route>
                <Route exact path="/products" component={Products}></Route>
                <Route exact path="/product/:id" component={Product}></Route>
                <Route path="/" component={Products}></Route>
            </Switch>
        </Router>
    );
}

export default App;
