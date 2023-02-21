import React from 'react'
import DataTable from "react-data-table-component"

const Table = ({ data, filterNames }) => {
  const columns = filterNames.map((name, index) => ({
    name: name,
    selector: row => row[name],
    sortable: index === 0
  }))

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        defaultSortFieldId
        pagination={5}
        highlightOnHover
      />
    </div>
  )
}

export default Table