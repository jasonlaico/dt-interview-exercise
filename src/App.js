import logo from './logo.svg';
import Spinner from './components/Spinner';
import React, {useState, useEffect} from 'react';
import './App.css';
import data from './data.json'
import {Pagination} from '@material-ui/lab'
//import Slider from './slider/Slider';

function App() {
  //const [user,setUsers]=useState({})
  const [ready, setReady] = useState(false)
  const [pagenumber,setpageNumber]=useState(1)
  const [userperPage,setUserPerPage]=useState(10)
  const [comp,setCompany]=useState("")
  const [minimumSales, setminimumSales] = useState(0);
  const [filteredResults, setFilteredResults] = useState([])

  const getSubTotal = () => {
    let subtotal = 0;
    filteredResults.forEach(item => {
      subtotal += item.sales
    })
    return Math.round(subtotal).toFixed(2);
  }
  const getTotal = () => {
    let total = 0;
    data.forEach(item => {
      total += item.sales
    })
    return Math.round(total).toFixed(2);
  }

  // Find clients with sales higher than $800.
  // From these clients, calculate the average sales figure.
  // Find what percentage of total clients these high performers represent.
  function getNumberofClients(){
    let numberOfClients = 0;
    data.forEach(item => {
      if (item.sales > 800) numberOfClients++;
    })
    return numberOfClients
  }
  function getAvgMonthlySales(){
    let numberOfClients = 0;
    let totalSales = 0;
    data.forEach(item => {
      if (item.sales > 800) {
        numberOfClients++;
        totalSales += item.sales;
      }
    })
    return Math.round(totalSales/numberOfClients).toFixed(2)
  }
  const getPercentage = () => (getNumberofClients() / data.length) * 100;
  
  

  // This mimics the CoomponentDidMount React Lifecycle method
  useEffect(()=>{  
    //filter results
    filter("", 0);

    setReady(true);
  },[])

  function filter(comp, minimumsales, selected = pagenumber){
    const pagevisit = (selected - 1)*userperPage;

    setFilteredResults(data.slice(pagevisit,pagevisit+userperPage).filter((item,i)=>{
      if(comp ===""){
        if(item.sales >= minimumsales)
          return item
      }else if(item.company.toLocaleLowerCase().includes(comp.toLocaleLowerCase())){
        if(item.sales >= minimumsales)
          return item
      }
    }
    ))
  }

  

  function minimumSalesOnChange(e){
    console.log(e.target.value)
    setminimumSales(e.target.value);
  }
  function onFilterClick(){
    filter(comp, minimumSales);
  }
  // const onFilterClick = () => {
  //   const temp_filteredResults = {
  //     comp: comp,
  //     minimumSales: minimumSales
  //   };
  //   setFilteredResults(temp_filteredResults);
  // }

  function refreshDataClick(){
    filter('', 0,);
  }

  const pageCount = Math.ceil(data.length/userperPage)
  const ChangePage=(event, selected)=>{
    console.log('page ', selected)
    setpageNumber(selected)
    filter(comp, minimumSales, selected);
  }
// let calldata=user&&user.slice(pagevisit,pagevisit+userperPage).filter((item,i)=>{
//   if(filteredResults.comp ==""){
//     if(item.sales >= filteredResults.minimumSales)
//       return item
//   }else if(item.company.toLocaleLowerCase().includes(filteredResults.comp.toLocaleLowerCase())){
//     if(item.sales >= filteredResults.minimumSales)
//       return item
//   }
// }).map((item)=>{
//   return(
//     <tr key={item.id}>
//     {/* <td>{item.id}</td> */}
//     <td>{item.name}</td>
//     <td>{item.company}</td>
//     <td>{item.sales}</td>
//   </tr>
//   )
// })



const searchCompany=(e)=>{
setCompany(e.target.value)
}

  return (ready? <>
  <div className="App">
    <div className="appcontainer">
   <h2 className="title">Global Sales</h2>

    <div className="filterbox">
      <input className="search" onChange={searchCompany} value={comp} placeholder="Company"/>
      <h3>Minimum Sales ($)</h3>
      <div className="slider-container">
        <input type="range" max={1500} onChange={minimumSalesOnChange} ></input>
        <div class="box">{minimumSales}</div>
      </div>
      <button className="filterbtn" onClick={onFilterClick}>FILTER RESULTS</button>
    </div>
    {/* <Slider 
          min={0}
          max={100}
          step={1}
          defaultLength={rangeValue}
          value={ryangeValue}
          onChangeValue={onChangeSlider}
          linearGradientColor="#4aa1f3"
          rangeBackgroundColor="#d7dcdf"
          sliderThumbColor="#4aa1f3"
        /> */}

<div className="data-container">
  <h2 >Sales Data</h2>
  <h4 onClick={refreshDataClick}>REFRESH DATA</h4>
</div>

<div className="table-container">
  {/* <table border={1}> */}
  <table className="tabledata">
        {/* <th>id</th> */}
        <tr>
        <th className="name">Name</th>
        <th>Company</th>
        <th>Monthly Sales</th>
        <th></th>
        </tr>
     {filteredResults.map((item)=>{
      return(
        <tr key={item.id}>
        {/* <td>{item.id}</td> */}
        <td className="name">{item.name}</td>
        <td className="company">{item.company}</td>
        <td>{item.sales}</td>
        {item.sales >= 1200? <td><i class="far fa-star shadow-pop-tr"></i></td> : <td></td>}
      </tr>
      )
    })}
    </table>
  <div className="sales-container">
   <div className="subtotal">
   <span>Sales Subtotal</span>
    <span>{getSubTotal()}</span>
  </div>
  <div className="total">
  <span>Total Sales</span>
    <span>{getTotal()}</span>
  </div> 
</div>
</div>

    <div className="paginationcontainer">
      <Pagination
        count={pageCount}
        onChange={ChangePage}

    />
    {/* previousLabel={"<"}
nextLabel={">"}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
pageCount={pageCount}
onPageChange={ChangePage}
containerClassName={"paginationBttns"}
previousLinkClassName={"previousBttn"}
nextLinkClassName={"paginationDisabled"}
activeClassName={"paginationActive"} */}
  </div>

   <h2 className="top-performers">Top Performers (800+/month)</h2>
    <div className="perfomers">
   
   <div className="table-container">
    <table className="tabledata">
   <tr>
    <td className="first_element">Number of Clients</td>
    <td></td>
    <td className="last_element">{getNumberofClients()}</td>
  </tr>
  <tr>
    <td className="first_element">Average Monthly Sales</td> 
    <td></td>  
    <td className="last_element">${getAvgMonthlySales()}</td>
  </tr>
  <tr>
    <td className="first_element">Percentage of Number of Clients</td>
    <td></td>  
    <td className="last_element">{getPercentage()}%</td>
  </tr>
</table>
</div>

    </div>
    </div>
    </div>
  </> : <Spinner />
  
  );
}

export default App;
