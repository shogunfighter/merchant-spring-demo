import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

// Styled table component

const TableWrapper = styled.div`
  font-family: "Roboto";
  
  background-color: #ffffff;
  padding-top: 10px;
  padding-bottom: 10px;

  border-collapse: collapse;

  margin: 0 auto;
  margin-top: 20px;

  @media (max-width: 767px) {
    width: 576px;
    font-size: 14px;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: 768px;
    font-size: 16px;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    width: 992px;
    font-size: 18px;
  }

  @media (min-width: 1200px) {
    width: 1200px;
    font-size: 20px;
  }

`;

const TableLabel = styled.div`
  font-size: 20px;
  margin: 10px;
`;

const Table = styled.table`
  background-color: #ffffff;
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-transform: uppercase;
  padding: 8px;
  background-color: #a6a8b7;
  color: #dcdce4;
  font-weight: bold;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f2f2f4;
`;

const TableCell = styled.td`
  text-align: center;
  padding: 8px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

interface PaginationButtonProps {
  active: boolean;
}
const PaginationButton = styled.button<PaginationButtonProps>`
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: ${props => (props.active ? '#a6a8b7' : '#f2f2f4')};
  color: #fff;
  border: none;
  border-radius: 3px;
`;

type TParam = {
  itemsPerPage: number;
};

export const TableWithPagination = ({ itemsPerPage }: TParam) => {
  const [rawData, setRawData] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<any[]>([]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("http://localhost:8080/sales");
      const data = await result.json();

      setRawData(data);
      setCurrentPage(1);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(rawData?.slice(indexOfFirstItem, indexOfLastItem));
  }, [rawData, currentPage, itemsPerPage]);


  if (currentItems) {
    return (

      <TableWrapper>
        <TableLabel>Data Records</TableLabel>
        <Table>
          <thead>
            <tr>
              {currentItems?.length > 0 && Object.keys(currentItems[0]).map((kStr, id) => <TableHeader key={id}>{kStr}</TableHeader>)}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item: any, itemId) => (
              <TableRow key={itemId}>
                {Object.values(item).map((vStr, id) => <TableCell key={id}>{vStr}</TableCell>)}
              </TableRow>
            ))}
          </tbody>
        </Table>
        <PaginationWrapper>
          Page:
          {Array.from({ length: Math.ceil(rawData?.length / itemsPerPage) }).map((_, index) => (
            <PaginationButton key={index} active={(index === currentPage - 1)} onClick={() => paginate(index + 1)}>
              {index + 1}
            </PaginationButton>
          ))}
        </PaginationWrapper>
      </TableWrapper>
    );
  }
  else {
    return <div>No data</div>
  }
};