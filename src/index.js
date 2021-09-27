import React from "react";
import ReactDOM from "react-dom";
import Menu from "./pizzas.json";
import {ReactComponent as CollapseIcon} from "./collapse.svg"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pizzas: Menu.pizzas,
            order: []
        }
    }

    //filters order, removes one pizza and the whole item if there is no pizza left
    removePizza(id) { 
        var neworder = this.state.order.map(el => {
            if (el === id) {
                return [el[0]-1, el[1], el[2]];
            }
            
            return el;
        });
       
        
        neworder = neworder.filter(el => el[0] > 0);

        this.setState(({
            order: neworder
        }));
    }

    //searches for a pizza by its name and adds one more if found, otherwise adds a new item with this pizza and price
    addPizza(name, price) {
        let found = false;
        this.setState({
            order: this.state.order.map(el => {
                if(el[1] === name && el[2] === price) {
                    found = true;
                    return [el[0]+1, el[1], el[2]];
                }
                return el;
            })
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

    render() {
        const order = this.props.order; 
        return (
            <div class="infobar">
                <div class="header">YOUR ORDER</div>
                <CurrentOrder order={order} removePizza={this.props.removePizza.bind(this)}/>
                <TotalAndPayment order={order} sendOrder={this.props.sendOrder.bind(this)}/>
            </div>
        )
    }
}

class CurrentOrder extends React.Component {
    //contains all orders and renders them as a list


    render() {
        const order = this.props.order;
        return (
            <div class="orders">
                <ul>
                    {order.map((elem) =>
                    <li onClick={this.props.removePizza.bind(this, elem)} key={elem[1]}>
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
 
    render() {
        const order = this.props.order;
        return (
            <ShortBorder height={2} distance={48} color="black" className="shortBorder">
                <div class="total">
                    <div>Total:</div>
                    <div>€ {(order.reduce((prevVal, current) => prevVal + (current[2]*current[0]), 0)/100).toFixed(2)}</div>
                    <button class="send" onClick={this.props.sendOrder.bind(this)}>Send Order</button>
                </div>
            </ShortBorder>
        )
    }
}

class Products extends React.Component {
    //contains a list of all products (taken from pizzas.json) and maps them


    render() {
        const menu = this.props.menu;
        return (
            <ul id="products">
                {menu.map((elem) => 
                    <Product name={elem.name} price={elem.price} addPizza={this.props.addPizza.bind(this)}/>
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

    
    render() {
        return (
            <li class="product">
                <div class="product-main">
                    <button class="product-extend" onClick={() => this.setState({expanded: !this.state.expanded})}>
                        {this.state.expanded ? 
                        (<CollapseIcon style={{height:"50px", width:"50px", fill:"#9F9F9F", transform:"rotate(90deg)"}}/>) : (<CollapseIcon style={{height:"50px", width:"50px", fill:"#9F9F9F"}}/>)}
                     </button>
                    <div class="product-name">{
                        this.props.name.length <= 25 ? this.props.name : this.props.name.substring(0,22) + "..."
                    }</div>
                    <div class="product-price">€ {(this.props.price/100).toFixed(2)}</div>
                    <button class="product-add" onClick={this.props.addPizza.bind(this, this.props.name, this.props.price)}>&#x002B;</button>
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
