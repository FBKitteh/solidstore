import { render } from "solid-js/web";
import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store"

const sizeRatio = {
  S: .25,
  M: .5,
  L: .75,
  XL: 1
}
type Size = keyof typeof sizeRatio

const [drinks, setDrinks] = createStore({
  requestedDrinks: [{
    brand: "sprite",
    size: "M",
    served: false
  },
  {
    brand: "sprite",
    size: "L",
    served: false
  }],
  drinkSupply: {
    sprite: 3,
  }
})
type Brands = keyof typeof drinks.drinkSupply

function toSmall(amount:number, size: Size) {
  return (sizeRatio[size] / sizeRatio.S) * amount
}

function toXL(amount:number, size: Size) {
  return (sizeRatio[size] / sizeRatio.XL) * amount
}

function ShowDrinkRequest(props:{brand: Brands, size: Size, id: number, served: boolean}) {
  const sizeInSmall = () => toSmall(1, props.size)
  const serve = () => {
    const currentSupply = drinks.drinkSupply[props.brand]
    const currentSmall = toSmall(currentSupply, "XL")
    const leftover = toXL(currentSmall - sizeInSmall(), "S")
    if (leftover < 0) return
    setDrinks("drinkSupply", props.brand, leftover)
    setDrinks("requestedDrinks", props.id, "served", true)
  }
  return (
    <div>
      {props.brand} 
      <br/>
      {props.size} ({sizeInSmall()} small drinks)
      <button onClick={serve} disabled={props.served}>Serve</button>
      <br/>
      <br/>
    </div>
  )
}

function App() {
  return (
    <div>
      <h2>Requested Drinks:</h2>
      <For each={drinks.requestedDrinks}>{(d, i) => <ShowDrinkRequest {...d} id={i()}/>}</For>
      <hr/>
      <h2> Drink Supply: </h2>
      <h3> Sprite: {drinks.drinkSupply.sprite / sizeRatio.S} Small Drinks</h3>
      <hr/>
    </div>
  )
}

render(() => <App />, document.getElementById("app")!);
