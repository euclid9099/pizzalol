import React from "react";
import ReactDOM from "react-dom";
import Menu from "./pizzas.json";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pizzas: Menu.pizzas,
            order: []
        }
        this.removePizza = this.removePizza.bind(this);
        this.minusOnePizza = this.minusOnePizza.bind(this);
        this.sendOrder = this.sendOrder.bind(this);
        this.addPizza = this.addPizza.bind(this);
    }

    //filters order, removes one pizza and the whole item if there is no pizza left
    removePizza(id) { 
        this.setState(prevState => ({
            order: prevState.order.filter(el => this.minusOnePizza(el,id) )
        }));
    }

    //remmoves one pizza, and also returns 'false' if the item should be removed
    minusOnePizza(el, id) {
        if (el === id) {
            el[0]--;
            if (el[0] <= 0) {
                return false;
            }
        }
        return true;
    }

    //searches for a pizza by its name and adds one more if found, otherwise adds a new item with this additional pizza and price
    addPizza(name, price) {
        let found = false;
        this.state.order.forEach(element => {
            if (element[1] === name) {
                this.setState(({
                    element: element[0] += 1
                }))
                found = true;
            }
        });

        if (!found) {
            this.setState({
                order: [...this.state.order, [1,name,price]]
            })
        }
        console.log(this.state.order);
    }
    
    //clears order and alerts the user, could do more if I weren't lazy
    sendOrder() {
        this.setState({
            order: []
        })
        alert("order sent!");
    }

    render() {
        return (
            <div id="app">
                <InfoBar order={this.state.order} removePizza={this.removePizza.bind(this)} sendOrder={this.sendOrder.bind(this)}/>
                <Products menu={this.state.pizzas} addPizza={this.addPizza.bind(this)}/>
            </div>
        );
    }
}

class InfoBar extends React.Component {
    //contains the users order and total pricing
    constructor(props) {
        super(props);
    }

    removePizza(id) {
        this.props.removePizza(id);
    }

    sendOrder() {
        this.props.sendOrder();
    }

    render() {
        const order = this.props.order; 
        return (
            <div class="infobar">
                <div class="header">YOUR ORDER</div>
                <CurrentOrder order={order} removePizza={this.removePizza.bind(this)}/>
                <TotalAndPayment order={order} sendOrder={this.sendOrder.bind(this)}/>
            </div>
        )
    }
}

class CurrentOrder extends React.Component {
    //contains all orders and renders them as a list
    constructor(props) {
        super(props);
    }

    removePizza(id) {
        this.props.removePizza(id);
    }

    render() {
        const order = this.props.order;
        return (
            <div class="orders">
                <ul>
                    {order.map((elem) =>
                    <li onClick={this.removePizza.bind(this, elem)} key={elem[1]}>
                        <div>{elem[0]}x {elem[1]}</div>
                        <div>€ {(elem[2]/100).toFixed(2)}</div>
                    </li>)}
                </ul>
            </div>
        )
    }
}

class TotalAndPayment extends React.Component {
    //contains the total cost of your order and a button to send your order
    sendOrder() {
        this.props.sendOrder();
    }

    render() {
        const order = this.props.order;
        return (
            <ShortBorder height={2} distance={48} color="black" className="shortBorder">
                <div class="total">
                    <div>Total:</div>
                    <div>€ {(order.reduce((prevVal, current) => prevVal + (current[2]*current[0]), 0)/100).toFixed(2)}</div>
                    <button class="send" onClick={this.sendOrder.bind(this)}>Send Order</button>
                </div>
            </ShortBorder>
        )
    }
}

class Products extends React.Component {
    //contains a list of all products (taken from pizzas.json) and maps them
    constructor(props) {
        super(props);
    }

    addPizza(name, price) {
        this.props.addPizza(name, price);
    }

    render() {
        const menu = this.props.menu;
        return (
            <ul id="products">
                {menu.map((elem) => 
                    <Product name={elem['name']} price={elem['price']} addPizza={this.addPizza.bind(this)}/>
                )}
            </ul>
        )
    }
}

class Product extends React.Component {
    //contains one product with name, price, a button to collapse a description and a button to add this pizza to your order
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    addPizza(name, price) {
        this.props.addPizza(name, price);
    }

    render() {
        return (
            <li class="product">
                <div class="product-main">
                    <button class="product-extend" onClick={() => this.setState({expanded: !this.state.expanded})}>
                        {this.state.expanded ? 
                        <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 0 24 24" width="50px" fill="#9F9F9F"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 0 24 24" width="50px" fill="#9F9F9F"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"/></svg>}
                     </button>
                    <div class="product-name">{
                        this.props.name.length <= 25 ? this.props.name : this.props.name.substring(0,22) + "..."
                    }</div>
                    <div class="product-price">€ {(this.props.price/100).toFixed(2)}</div>
                    <button class="product-add" onClick={this.addPizza.bind(this, this.props.name, this.props.price)}>&#x002B;</button>
                </div>
                {this.state.expanded && 
                    <div class="product-info">
                        This is where a description of the pizza should be, but I didn't get to that yet and would need to add all this info to pizzas.json
                    </div>
                }
            </li>
        )
    }
}

function ShortBorder(props) {
    //adds a short line above its children to create that line above subtotals
    const distance = props.distance;
    const border = props.height + "px solid " + props.color;

    return (
        <div style={{position:"relative"}} className={props.className}>
            <div style={{borderTop:border, position:"absolute", left:distance, right:distance}}></div>
            {props.children}
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));