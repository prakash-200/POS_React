
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ItemRequest from "./components/ItemRequest"
import InventoryTable from './components/Inventory'
import Billing from './components/Billing'
import SalesRecord from './components/SalesRecord'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='ItemRequest' element={<ItemRequest />} />
        <Route path='Inventory' element={ <InventoryTable /> } />
        <Route path='Billing' element={ <Billing /> } />
        <Route path='record' element={ <SalesRecord /> } />
      </Routes>
    </Router>
  )
}

export default App
