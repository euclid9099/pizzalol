import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './pizzas.json';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pizzas: Menu.pizzas,
            order: [],
        };

        this.removePizza = this.removePizza.bind(this);
        this.minusOnePizza = this.minusOnePizza.bind(this); // Doesn't need to be bound; Binding is only neccesary when the function is later called outside of the class scope
                                                            // Refer to https://reactjs.org/docs/handling-events.html; Text: "You have to be careful about the meaning of this..."
        this.sendOrder = this.sendOrder.bind(this);
        this.addPizza = this.addPizza.bind(this);
    }

    //filters order, removes one pizza and the whole item if there is no pizza left
    removePizza(id) {
        this.setState(prevState => ({
            order: prevState.order.filter(el => this.minusOnePizza(el, id)),
        }));
    }

    //remmoves one pizza, and also returns 'false' if the item should be removed
    minusOnePizza(el, id) {
        if (el === id) {
            el[0]--; // You should not mutate state in react; Instead, the existing state should be copied, then changed and the changed version should be set as the new state
                     // In other words: This array should by all means be considered immutable (non-changeble and non-assignable)
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
                this.setState({
                    element: element[0] += 1,
                });

                // Multiple problems with this code:
                //  1. State shouldn't be mutated here either, but element[0] += 1 is assigning a new value to the original element[0] and therefore mutating element
                //  2. The whole statement is misleading, because the the this.state.element is never used anywhere in the code, therefore setting the state to {element: element[0] + 1}
                //     doesn't make any sense. This means that the call to this.setState could be omitted whilst still achieving the same effect on the state used in the application;
                //     However, if you remove the this.setState part, the application won't update - try it - as it doesn't even know anything changed (which is one reason why you should not mutate)
                //     
                //     Basically I'm saying that the code 
                //      element[0] += 1;
                //      this.setState({element: 1});
                //     has the exact same effect on the application than the code above and that doesn't make any sense and using setState as a means to force an update is a bad practice.

                found = true;
            }
        });

        if (!found) {
            this.setState({
                order: [...this.state.order, [1, name, price]], // This is how state should be updated without mutating it
            });
        }
        console.log(this.state.order);
    }

    //clears order and alerts the user, could do more if I weren't lazy LAZINESS WINS
    sendOrder() {
        this.setState({
            order: [],
        });
        alert('order sent!');
    }

    render() {
        return (
            <div id="app">
                <InfoBar
                    order={this.state.order}
                    // This binding is not nesessary here, as the function is already bound at line 12:45; simply passing this.removePizza would be sufficient
                    removePizza={this.removePizza.bind(this)}
                    // Same
                    sendOrder={this.sendOrder.bind(this)}
                />
                <Products
                    menu={this.state.pizzas}
                    // And also same
                    addPizza={this.addPizza.bind(this)}
                />
            </div>
        );
    }
}

class InfoBar extends React.Component {
    //contains the users order and total pricing
    // This constructor is redundant as the base class constructor (ergo super) is inherited from the parent if the child doesn't define its own constructor
    constructor(props) { 
        super(props); 
    }

    // Why is this function defined again in the component?
    removePizza(id) {
        this.props.removePizza(id);
    }

    // This also wouldn't need to be defined in the component, as the function is already passed in as props
    sendOrder() {
        this.props.sendOrder();
    }

    render() {
        const order = this.props.order;
        return (
            <div class="infobar">
                <div class="header">YOUR ORDER</div>
                <CurrentOrder order={order} 
                    //You could just pass this.props.removePizza here and wouldn't need to redefine the function above
                    removePizza={this.removePizza.bind(this)} 
                />
                <TotalAndPayment order={order} 
                    // Same here
                    sendOrder={this.sendOrder.bind(this)} 
                />
            </div>
        );
    }
}

class CurrentOrder extends React.Component {
    //contains all orders and renders them as a list
    // Same as above; This constructor is redundant and can be removed
    constructor(props) {
        super(props);
    }

    // Also same as above, why is this function even redefined here?
    removePizza(id) {
        this.props.removePizza(id);
    }

    render() {
        const order = this.props.order;
        return (
            <div class="orders">
                <ul>
                    {order.map(elem => (
                        <li 
                            // Could also just call this.props.removePizza(elem) here with an arrow function; Aditionally, bind with more than the this-attribute is pretty confusing 
                            onClick={this.removePizza.bind(this, elem)} key={elem[1]}
                        >
                            <div>
                                {elem[0]}x {elem[1]}
                            </div>
                            <div>€ {(elem[2] / 100).toFixed(2) /* Nice */}</div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

class TotalAndPayment extends React.Component {
    //contains the total cost of your order and a button to send your order

    // Also same as above; Doesn't need to be redefined
    sendOrder() {
        this.props.sendOrder();
    }

    render() {
        const order = this.props.order;
        return (
            // Interesting, but why not just use CSS or styled components or the style prop to style a border? (border-top or something)
            <ShortBorder height={2} distance={48} color="black" className="shortBorder">
                <div class="total">
                    <div>Total:</div>
                    <div>
                        € {(order.reduce((prevVal, current) => prevVal + current[2] * current[0], 0) / 100).toFixed(2)}
                    </div>
                    <button class="send" 
                        // You also could just use the function from the props here
                        onClick={this.sendOrder.bind(this)}
                    >
                        Send Order
                    </button>
                </div>
            </ShortBorder>
        );
    }
}

class Products extends React.Component {
    //contains a list of all products (taken from pizzas.json) and maps them

    // Redundant constructor
    constructor(props) {
        super(props);
    }

    // Same as above
    addPizza(name, price) {
        this.props.addPizza(name, price);
    }

    render() {
        const menu = this.props.menu;
        return (
            <ul id="products">
                {menu.map(elem => (
                    <Product 
                        // I would just write elem.name and elem.price here
                        name={elem['name']}
                        price={elem['price']} 
                        // Just pass this.props.addPizza
                        addPizza={this.addPizza.bind(this)} 
                    />
                ))}
            </ul>
        );
    }
}

class Product extends React.Component {
    //contains one product with name, price, a button to collapse a description and a button to add this pizza to your order

    // See, in this case the constructor is needed because there is other logic that must be executed inside
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }

    // Another redefinition
    addPizza(name, price) {
        this.props.addPizza(name, price);
    }

    render() {
        return (
            <li class="product">
                <div class="product-main">
                    <button class="product-extend" onClick={() => this.setState({ expanded: !this.state.expanded })}> {/* Great idea with the description! */}
                        {this.state.expanded ? (
                            // You could just import the whole SVG using import "{ReactComponent as CollapseIcon} from './collapse.svg'" here
                            // You can then write <CollapseIcon /> to display the imported SVG; Styling can be done via CSS as usual
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="50px"
                                viewBox="0 0 24 24"
                                width="50px"
                                fill="#9F9F9F"
                            >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                            </svg>
                        ) : (
                            // You could also just import the SVG here; Also, in order to reduce app sizes, you can just rotate the SVG 90deg in this case as it is the same
                            // image rotated
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="50px"
                                viewBox="0 0 24 24"
                                width="50px"
                                fill="#9F9F9F"
                            >
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" />
                            </svg>
                        )}
                    </button>
                    <div class="product-name">
                        {this.props.name.length <= 25 ? this.props.name : this.props.name.substring(0, 22) + '...'}
                    </div>
                    <div class="product-price">€ {(this.props.price / 100).toFixed(2)}</div>
                    <button 
                        class="product-add" 
                        // Could also just use the function from the props here
                        onClick={this.addPizza.bind(this, this.props.name, this.props.price)}
                    >
                        &#x002B; {/* Nice, always used an icon for this one */}
                    </button>
                </div>
                {this.state.expanded && (
                    <div class="product-info">
                        This is where a description of the pizza should be, but I didn't get to that yet and would need
                        to add all this info to pizzas.json
                    </div>
                )}
            </li>
        );
    }
}

function ShortBorder(props) {
    //adds a short line above its children to create that line above subtotals
    const distance = props.distance;
    const border = props.height + 'px solid ' + props.color;

    return (
        <div style={{ position: 'relative' }} className={props.className}>
            <div style={{ borderTop: border, position: 'absolute', left: distance, right: distance }}></div>
            {props.children}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

/*
    Great project; Just a few minor "mistakes" if its even fair to call them that. 
    The problems are mostly concerned with state handling and mutation which tends to be pretty hard to grasp.
    I still mutate state sometimes even in my newer projects and just can't spot it.
    Keep an eye out for the, however, as a lot of really, really, really hard to trace bugs are caused by state mutation

    There are also a few redundant parts in the code such as constructors or redefinitions of functions, 
    however none of these mistakes impair the functionality of the app

    I would also split the code a bit in the future, however this project is probably small enough to have everything in one file
 */
