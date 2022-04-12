import { useState, useEffect } from 'react'
import './App.css'
import { API_URL } from './utils/constants'
import { onSetTaxInfo, onChangeSelectedCar, clearInfo } from './utils/functions'
import baires from './utils/img/baires.png'
import logoBrand from './utils/img/logoArba.svg'
import footerImg from './utils/img/foot.png'
import axios from 'axios'


const initialTaxState =
{
  year: "",
  taxValuation: "",
  taxBase: "",
  category: "",
  taxTotal: 0,
}

const initialCarState = {
  id: "",
  brand: "",
  name: "",
  type: "",
  price: {}
}

function App() {
  const [cars, setCars] = useState([])
  const [taxCategories, setTaxCategories] = useState({})
  const [carInfo, setCarInfo] = useState(initialCarState)
  const [taxInfo, setTaxInfo] = useState(initialTaxState)
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    const { data } = await axios.get(API_URL);
    const { cars, taxCategories } = data;
    setCars(cars.sort((a, b) => a.brand.localeCompare(b.brand)))
    setTaxCategories(taxCategories)
  }, [])


  return (
    <>
      <header className='header'>
        <div className='brandContainer'>
          <img src={logoBrand}></img>
          <span>AGENCIA DE RECAUDACIÓN PROVINCIA DE BUENOS AIRES</span>
        </div>
      </header>

      <main className='main'>
        <nav className='navigation'>
          <p>Inicio / Guía de trámites / Automotores / <span>Calcular impuesto automotor</span></p>
        </nav>
        <h1>Calculá el impuesto de tu vehiculo</h1>
        <div className="calculatorContainer">
          <div className='inputsContainer'>
            <form action="" className='inputForm'>
              <label htmlFor="1">Seleccioná tu vehiculo:</label>
              <select disabled={carInfo.name.length && taxInfo.taxTotal ? true : false} name="" id="" value={carInfo.id} onChange={(e) => {
                onChangeSelectedCar(e, setCarInfo, cars)
              }}>
                <option value="" disabled></option>
                {cars?.length && cars.map(car => {
                  const { id, brand, name, type } = car
                  return (
                    <option value={id} key={id}>{brand} {name}</option>
                  )
                })}
              </select>
              <label htmlFor="1">Seleccioná el año de fabricación:</label>
              <select disabled={carInfo.name.length ? false : true} onChange={(e) => {
                if (e.target.value === '') {
                  return
                }
                onSetTaxInfo(e, setLoading, setTaxInfo, carInfo, taxInfo, taxCategories)
              }
              } defaultValue="">
                <option value=""></option>
                {carInfo.price && Object.keys(carInfo.price).map((year, index) => {
                  return (
                    <option value={year} key={`${year}_${index}`}>{year}</option>
                  )
                })}

              </select>
            </form>
            <button onClick={() => {
              clearInfo(setCarInfo, setTaxInfo, initialCarState, initialTaxState)
            }} className='clearButton'>
              Borrar
            </button>
          </div>
          <div className='resultContainer'>
            {loading ? <div className="col-3">
              <div className="snippet" data-title=".dot-pulse">
                <div className="stage">
                  <div className="dot-pulse"></div>
                </div>
              </div>
            </div> : taxInfo.taxValuation ? <div className='result'>

              <div className="resultsLabels"><span>Valuacion fiscal:</span>
                <span>Base Imponible:</span>
                <span>Categoría:</span>
                <span>Total anual:</span>
                <span>5 cuotas de:</span>
              </div>
              <div className="resultsNumbers"><span>$ {taxInfo.taxValuation.toLocaleString('es-AR')}</span>
                <span>$ {taxInfo.taxBase.toLocaleString('es-AR')}</span>
                <span># {taxInfo.category}</span>
                <span>$ {taxInfo.taxTotal.toLocaleString('es-AR')}</span>
                <span>$ {Math.round(taxInfo.taxTotal / 5).toLocaleString('es-AR')}</span>
              </div>
            </div> :
              <img src={baires} className='defaultImage' ></img>}
          </div>
        </div>

      </main>
      <footer className='footer'>
        <img src={footerImg} />
      </footer>
    </>
  )
}

export default App


