"use client"
import Image from "next/image";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    income: 233,
    expense: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expense: 1398,
    amt: 2210,
  },
  {
    name: 'March',
    income: 2000,
    expense: 9800,
    amt: 2290,
  },
  {
    name: 'April',
    income: 2780,
    expense: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    income: 1890,
    expense: 4800,
    amt: 2181,
  },
  {
    name: 'July',
    expense: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Aug',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    name: 'Sept',
    income: 3490,
    expense: 4300,
    amt: 2100,
  }, {
    name: 'Oct',
    income: 3490,
    expense: 4300,
    amt: 2100,
  }, {
    name: 'Nov',
    income: 3490,
    expense: 4300,
    amt: 2100,
  }, {
    name: 'Dec',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
];


const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/*TITLE*/}
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#add" />
          <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={10}/>
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={20}/>
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line type="monotone" dataKey="income" stroke="#C3EBFA"  strokeWidth={5}/>
          <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinanceChart