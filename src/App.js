import React, { useState, useEffect } from 'react';
import "./App.css"
import {data} from "./data/csvjson";
import {Multiselect} from "multiselect-react-dropdown";
import Table from './components/Table';


function App() {


	const [selectedFilters, setSelectedFilters] = useState(
		Object.keys(data[0]).reduce((acc, curr) => ({...acc, [curr]: []}), {}) ?? []
	)
	const [filterNamesWithValues, setfilterNamesWithValues] = useState(
		Object.keys(data[0]).reduce((acc, curr) => ({...acc, [curr]: {}}), {}) ?? {}
	)
	const [filteredData, setFilteredData] = useState(data)

	useEffect(() => {
		filterDataAndUpdateValues()
		calculateFrequency()
	}, [selectedFilters])

	const filterNames = Object.keys(data[0])

	const filterDataAndUpdateValues = () => {
		const filterKeys = Object.keys(selectedFilters)
		const filtersWithValues = filterKeys.filter(keys => selectedFilters[keys].length > 0)

		if (filtersWithValues.length === 0) 
			return setFilteredData(data)
		
		// filtering the available data based on the filters 
		const filteredData = data.filter(entry => {
			let satisfies = true
			for (let filtersWithValue of filtersWithValues) {
				if (!selectedFilters[filtersWithValue].includes(entry[filtersWithValue].toString()))
					satisfies = false
			}
			if (satisfies)
				return entry
		})
			
			// clearing the filterValues except the ones which are selected
		const filterDropDownData = Object.keys(data[0]).reduce((acc, curr) => {
			if (filtersWithValues.includes(curr)) {
				return {...acc, [curr]: filterNamesWithValues[curr]}
			}
			else
				return {...acc, [curr]: {}}
		}, {})

		setFilteredData(filteredData)
		setfilterNamesWithValues(filterDropDownData)
	}
		
	// Calculate frequency in order to update the values available in filters
	// This can further be used to show the number of entries in the filters fields
	const calculateFrequency = () => {			
		for (let obj of filteredData) {
			for (let name of filterNames) {
				const dataValue = obj[name]
				filterNamesWithValues[name][dataValue] = filterNamesWithValues[name][dataValue] + 1 || 1;
			}
		}
	}

	const handleUpdate = (e, filterName) => {
		const newSelectedState = {...selectedFilters, [filterName]: e}
		setSelectedFilters(newSelectedState)
	}
	
	const displayFilters = () => {
		calculateFrequency()
		if (Object.keys(filterNamesWithValues).length > 0)
			return Object.keys(filterNamesWithValues).map(filterName => (
				<div key={filterName}>
					<label>{filterName}</label>
					<Multiselect 
						options={Object.keys(filterNamesWithValues[filterName])}
						isObject={false}
						key={filterName}
						showCheckbox
						onSelect={(e) => handleUpdate(e, filterName)}
						onRemove={(e) => handleUpdate(e, filterName)}
						displayValue={filterName}
						selectedValues={selectedFilters[filterName]}
					/>
				</div>
			))
	}

	return (
		<div className='container'>
			<div className='filters'>
				{
					displayFilters()
				}
			</div>  
			<div>
				<Table data={filteredData} filterNames={filterNames} />
			</div>
		</div>
	)
}

export default App;