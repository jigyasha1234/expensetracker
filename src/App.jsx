import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import editIcon from './assets/editIcon.svg'
import closeIcon from './assets/closeIcon.svg'
import foodIcon from './assets/food.svg'
import giftIcon from './assets/gift.svg'
import travelIcon from './assets/travel.svg'

const pieSeries = [
  {
    arcLabel: (item) => `${item.value}%`,
    arcLabelMinAngle: 10,
    arcLabelRadius: '60%',
    data: [
      { id: 0, value: 30, label: 'Food' },
      { id: 1, value: 70, label: 'Entertainment' },
      { id: 2, value: 10, label: 'Travel' },
    ],
  },
]

const size = { width: 200, height: 200 }

const transactions = [
  { id: 1, title: 'Samosa', date: 'March 20, 2024', amount: 500, icon: foodIcon },
  { id: 2, title: 'Movi', date: 'June 25, 2024', amount: 300, icon: giftIcon },
  { id: 3, title: 'Auto', date: 'July 10, 2024', amount: 260, icon: travelIcon },
]

const clients = [
  { name: 'Entertainment', value: 420 },
  { name: 'Food', value: 300 },
  { name: 'Travel', value: 180 },
]

export default function App() {
  return (
    <Box sx={{ backgroundColor: '#0e0d0d', minHeight: '100vh', color: 'white', p: 2 }}>
      <h1>Expense Tracker</h1>
      

      {/* Section 1: two cards + pie chart (equal size, spaced) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          backgroundColor: '#3f3d3dff',
          height: { xs: 'auto', md: '300px' }
        }}
      >

        <Card
          sx={{
            backgroundColor: '#706e6eff',
            width: '355.4118px',
            height: '200px',
            borderRadius: '15px',
            boxShadow: '0px 4px 4px 0px #00000040',
            opacity: 1,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            p: 1,
          }}
        >
          <CardContent sx={{
            p: 0,
            marginTop: '15%', color: 'green',
          }}>
            <Typography variant="h6" component="div">
              <Box component="span" sx={{ color: 'white' }}>Wallet Balance:</Box>
              <Box component="span" sx={{ color: '#98e25d', ml: 1 }}>₹200</Box>
            </Typography>
          </CardContent>
          <CardActions sx={{
            p: 0, textAlign: 'center',
            alignItems: 'center'
          }}>
            <Button size="small" variant="contained" sx={{ bgcolor: '#98e25dff', margin: '20px' }}>+ Add Income</Button>
          </CardActions>
        </Card>

        <Card
          sx={{
            backgroundColor: '#706e6eff',
            width: '355.4118px',
            height: '200px',
            borderRadius: '15px',
            boxShadow: '0px 4px 4px 0px #00000040',
            opacity: 1,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            p: 1,
          }}
        >
          <CardContent sx={{
            p: 0,
            marginTop: '15%', color: 'green',
          }}>
            <Typography variant="h6" component="div">
              <Box component="span" sx={{ color: 'white' }}>Expenses:</Box>
              <Box component="span" sx={{ color: '#f0b505ff', ml: 1 }}>₹200</Box>
            </Typography>
          </CardContent>
          <CardActions sx={{
            p: 0, textAlign: 'center',
            alignItems: 'center'
          }}>
            <Button size="small" variant="contained" sx={{ bgcolor: '#d14e23ff', margin: '20px' }}>+ Add Income</Button>
          </CardActions>
        </Card>

        <Box sx={{ width: 200, height: 120, marginBottom: '80px' }}>
          <PieChart
            series={pieSeries}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: 'bold',
              },
            }}
            {...size}
          />
        </Box>

      </Box>

     { /* Section 2: left list with icons + right horizontal bar chart */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          <Box sx={{ width: '55%', backgroundColor: '#fff', p: 1, borderRadius: 1.5, height: '290px', overflowY: 'auto' }}>    
            <Typography variant="h6" sx={{ mb: 0.5, color: 'black' }}>
          Recent Transactions
            </Typography>    
            <List>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <ListItem
          sx={{ py: 0.5 }}
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body1" sx={{ color: transaction.amount > 0 ? 'green' : 'red', p: 0.5 }}>
            ₹{transaction.amount}
              </Typography>
              <IconButton edge="end" aria-label="edit" size="small" sx={{ p: 0.5 }}>
            <img src={editIcon} alt="edit" style={{ width: 18, height: 18, display: 'block', filter: 'invert(1)' }} />
              </IconButton>
              <IconButton edge="end" aria-label="delete" size="small" sx={{ p: 0.5 }}>
            <img src={closeIcon} alt="delete" style={{ width: 18, height: 18, display: 'block', filter: 'invert(1)' }} />
              </IconButton>
            </Box>
          }
              >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'transparent', width: 36, height: 36 }}>
              <img src={transaction.icon} alt={transaction.title} style={{ width: 18, height: 18, objectFit: 'contain', display: 'block' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={transaction.title}
            secondary={transaction.date}
            sx={{ color: 'black' }}
          />
              </ListItem>
              <Divider component="li" sx={{ bgcolor: '#e0e0e0' }} />
            </React.Fragment>
          ))}
           <Pagination count={1} defaultPage={1} boundaryCount={0} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }} />
            </List>
          </Box>
          <Box sx={{ width: '35%', backgroundColor: '#fff', p: 1, borderRadius: 1.5, height: '290px', overflowY: 'auto', marginLeft: '16px' }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'black' }}>
          Top Expenses
            </Typography>
            {/* Bar chart with no vertical and horizontal lines just showing the top expenses entertainment, food and travel and these name only displayed */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              layout="vertical"
              data={clients}
              margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
            >
              <XAxis type="number" hide />
              {/* Reserve space for long category labels so they don't get clipped */}
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Bar dataKey="value" fill="#8884d8" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  )
}

