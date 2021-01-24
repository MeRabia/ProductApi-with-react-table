import React, { Component } from 'react'
import axios from 'axios'
import ReactTable from "react-table"; 
import 'react-table/react-table.css'


export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      products: [],
      loading:true
    }
  }
  async getUsersData(){
    try {
      const res = await axios.get('http://app.getrecall.com:8080/products')
      console.log(res.data)
      this.setState({loading:false, products: res.data.products})
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount(){
    this.getUsersData()
  }

  renderFeaturesCell = (props) => {
    return <div>
      {props.value.map(feature => <p>
        {feature}
      </p>)}
    </div>
  }

  renderSpecificationsCell = (props) => {
    const listCategory = [...new Set(props.value.map(spec => spec.category))];
    return <div>
      {listCategory.map(specCategory => <div>
        <p style={{fontWeight:'bold'}}>
        {specCategory}
        </p>
        <ReactTable
          data={props.value.filter(spec => spec.category === specCategory)}
          columns={[{
            Header : 'Name',
            accessor: 'name',
            
        },
        {
            Header : 'Value',
            accessor: 'value',
      
        }]}
        showPagination={false}
        >

        </ReactTable>
       {/*  <ul>
          {props.value.filter(spec => spec.category === specCategory).map(spec => <p>
            {spec.name+" : "+spec.value}
          </p>)}
        </ul> */}
      </div>)}
    </div>
  }


  renderPDFCell = (props) => {
    console.log(props)
    return <div>
    <a href={props.original.datasheet}><button class="btn"><i class="fa fa-download"></i> Download</button></a>
  </div>;
  }

  renderImageCell = (props) => {
   //console.log(props)
    return <div>
      <a href={props.original.link}><img src={props.value} width="100px" ></img></a>
    </div>;
  }

  renderNameCell = (props) => {

     return <div>
       <a href={props.original.link}><p>{props.value}</p></a>
     </div>;
   }

   defaultFilter = (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined ? String(row[id]).toLowerCase().startsWith(String(filter.value).toLowerCase()) : true
  }

  renderCategoryFilter = ({filter,onChange,column})=> {return <select  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}>
   {  [...new Set(this.state.products.map(prod => prod.category))].map(category => <option>{category}</option>) }
  </select>}
  
  render() {
    const columns = [
  {
      Header : 'Image',
      accessor: 'thumbnail',
      Cell: this.renderImageCell
  },
  {
    Header : 'Name',
    accessor: 'name',
    Cell: this.renderNameCell
    
},
{
    Header : 'Description',
    accessor: 'description',

},
  {
      Header : 'Features',
      accessor: 'features',
      Cell: this.renderFeaturesCell,
      width:300
  },
  {
      Header : 'Specifications',
      accessor: 'specifications',
      Cell: this.renderSpecificationsCell,
      width:400
  },
  {
      Header : 'Category',
      accessor: 'category',
      filterable:true,
      Filter:this.renderCategoryFilter,
      width:230
  },
  {
      Header : 'Subcategory',
      accessor : 'subcategory',
  },
  {
      Header : 'Creation Date',
      accessor: 'createdAt',
  },
  {
      Header : 'Update Date',
      accessor : 'updatedAt',
  },
  {
      Header : 'PDF',
      accessor: 'productsheet',
      Cell: this.renderPDFCell
  },
  ]
    return (
      <ReactTable  columns={columns} data={this.state.products} defaultFilterMethod={this.defaultFilter}/>
    )
  }
}

