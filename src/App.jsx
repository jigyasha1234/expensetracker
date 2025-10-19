import React, { useState, useEffect } from 'react'
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
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

import editIcon from './assets/editIcon.svg'
import closeIcon from './assets/closeIcon.svg'
import foodIcon from './assets/food.svg'
import giftIcon from './assets/gift.svg'
import travelIcon from './assets/travel.svg'

const size = { width: 200, height: 200 }

const categoryIconMap = {
  Food: foodIcon,
  Entertainment: giftIcon,
  Travel: travelIcon,
  Other: giftIcon,
}

export default function App() {
  // non-persistent: wallet and expenses reset on refresh
  const [wallet, setWallet] = useState(5000)
  const [expenses, setExpenses] = useState([])

  const [incomeOpen, setIncomeOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [incomeAmount, setIncomeAmount] = useState('')
  const [form, setForm] = useState({ title: '', price: '', category: 'Food', date: '' })

  const clients = React.useMemo(() => {
    const grouped = {}
    for (const e of expenses) {
      grouped[e.category] = (grouped[e.category] || 0) + Number(e.price)
    }
    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }, [expenses])

  // compute totals for the three categories and percentages
  const categoryOrder = ['Food', 'Travel', 'Entertainment']
  const categoryColors = {
    Food: '#FFBB28',
    Entertainment: '#FF8042',
    Travel: '#0088FE',
  }

  const categoryTotals = React.useMemo(() => {
    const totals = { Food: 0, Entertainment: 0, Travel: 0 }
    for (const e of expenses) {
      if (totals.hasOwnProperty(e.category)) totals[e.category] += Number(e.price)
    }
    return totals
  }, [expenses])

  const pieSeries = React.useMemo(() => {
    const totalWallet = wallet || 1
    const values = categoryOrder.map((k) => categoryTotals[k] || 0)
    const p = values.map((v) => Math.round((v / totalWallet) * 100))
    return [{
      arcLabel: (item) => `${item.value}%`,
      arcLabelMinAngle: 5,
      arcLabelRadius: '60%',
      data: categoryOrder.map((name, i) => ({ id: i, value: p[i], label: name })),
    }]
  }, [categoryTotals, wallet])

  function openAddIncome() {
    setIncomeAmount('')
    setIncomeOpen(true)
  }

  function handleAddIncome(e) {
    e.preventDefault()
    const amount = Number(incomeAmount)
    if (!amount || amount <= 0) return alert('Enter a valid income amount')
    setWallet((w) => w + amount)
    setIncomeOpen(false)
  }

  function openAddExpense() {
    setForm({ title: '', price: '', category: 'Food', date: '' })
    setEditingExpense(null)
    setExpenseOpen(true)
  }

  function handleAddExpense(e) {
    e.preventDefault()
    const { title, price, category, date } = form
    if (!title || !price || !category || !date) return alert('Please fill all fields')
    const amount = Number(price)
    if (amount > wallet) return alert('Insufficient balance')
    const newExpense = {
      id: Date.now(),
      title,
      date,
      price: amount,
      category,
      icon: categoryIconMap[category] || categoryIconMap['Other'],
    }
    setExpenses((s) => [newExpense, ...s])
    setWallet((w) => w - amount)
    setForm({ title: '', price: '', category: 'Food', date: '' })
    setExpenseOpen(false)
  }

  function startEdit(exp) {
    setEditingExpense(exp)
    setForm({ title: exp.title, price: String(exp.price), category: exp.category, date: exp.date })
    setExpenseOpen(true)
  }

  function handleEditExpense(e) {
    e.preventDefault()
    const { title, price, category, date } = form
    if (!title || !price || !category || !date) return alert('Please fill all fields')
    const amount = Number(price)
    const prev = editingExpense
    const diff = amount - prev.price
    if (diff > wallet) return alert('Insufficient balance for this edit')
    const updated = { ...prev, title, price: amount, category, date, icon: categoryIconMap[category] }
    setExpenses((s) => s.map((it) => (it.id === prev.id ? updated : it)))
    setWallet((w) => w - diff)
    setEditingExpense(null)
    setForm({ title: '', price: '', category: 'Food', date: '' })
    setExpenseOpen(false)
  }

  function handleDelete(exp) {
    if (!confirm('Delete this expense?')) return
    setExpenses((s) => s.filter((it) => it.id !== exp.id))
    setWallet((w) => w + Number(exp.price))
  }

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
          height: { xs: 'auto', md: '300px' },
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
          <CardContent
            sx={{
              p: 0,
              marginTop: '15%',
              color: 'green',
            }}
          >
            <Typography variant="h6" component="div">
              <Box component="span" sx={{ color: 'white' }}>
                Wallet Balance:
              </Box>
              <Box component="span" sx={{ color: '#98e25d', ml: 1 }}>{`₹${wallet}`}</Box>
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              p: 0,
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Button type="button" onClick={openAddIncome} size="small" variant="contained" sx={{ bgcolor: '#98e25dff', margin: '20px' }}>
              + Add Income
            </Button>
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
          <CardContent
            sx={{
              p: 0,
              marginTop: '15%',
              color: 'green',
            }}
          >
            <Typography variant="h6" component="div">
              <Box component="span" sx={{ color: 'white' }}>
                Expenses:
              </Box>
              <Box component="span" sx={{ color: '#f0b505ff', ml: 1 }}>{`₹${expenses.reduce((s, e) => s + Number(e.price), 0)}`}</Box>
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              p: 0,
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Button type="button" onClick={openAddExpense} size="small" variant="contained" sx={{ bgcolor: '#d14e23ff', margin: '20px' }}>
              + Add Expense
            </Button>
          </CardActions>
        </Card>

        <Box sx={{ width: 220, height: 160, marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Pie chart (hidden when no expenses) */}
          {expenses.length > 0 && (
            <PieChart
              series={pieSeries}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                },
              }}
              {...size}
            />
          )}

          {/* Legend: labels placed in a single horizontal row beneath the chart */}
          <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categoryOrder.map((name) => {
              const amount = categoryTotals[name] || 0
              const percent = Math.round((amount / (wallet || 1)) * 100)
              return (
                <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, backgroundColor: categoryColors[name], borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 200, fontSize: '0.6rem' }}>{name}</Typography>   
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>

      {/* Section 2: left list with icons + right horizontal bar chart */}
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
            {expenses.length === 0 ? (
              <ListItem>
                <ListItemText primary="no kharch" sx={{ color: 'black', textAlign: 'center' }} />
              </ListItem>
            ) : (
              expenses.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <ListItem sx={{ py: 0.5 }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body1" sx={{ color: transaction.price > 0 ? 'green' : 'red', p: 0.5 }}>
                          ₹{transaction.price}
                        </Typography>
                        <IconButton edge="end" aria-label="edit" size="small" sx={{ p: 0.5 }} onClick={() => startEdit(transaction)}>
                          <img src={editIcon} alt="edit" style={{ width: 18, height: 18, display: 'block', filter: 'invert(1)' }} />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" size="small" sx={{ p: 0.5 }} onClick={() => handleDelete(transaction)}>
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
                    <ListItemText primary={transaction.title} secondary={transaction.date} sx={{ color: 'black' }} />
                  </ListItem>
                  <Divider component="li" sx={{ bgcolor: '#e0e0e0' }} />
                </React.Fragment>
              ))
            )}
            <Pagination count={1} defaultPage={1} boundaryCount={0} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }} />
          </List>
        </Box>
        <Box sx={{ width: '35%', backgroundColor: '#fff', p: 1, borderRadius: 1.5, height: '290px', overflowY: 'auto', marginLeft: '16px' }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'black' }}>
            Top Expenses
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={clients} margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} />
              <Bar dataKey="value" fill="#8884d8" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Add Income Dialog */}
      <Dialog open={incomeOpen} onClose={() => setIncomeOpen(false)}>
        <form onSubmit={handleAddIncome}>
          <DialogTitle>Add Balance</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="income"
              label="Income Amount"
              type="number"
              fullWidth
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              placeholder="Income Amount"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIncomeOpen(false)}>Cancel</Button>
            <Button type="submit">Add Balance</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={expenseOpen} onClose={() => { setExpenseOpen(false); setEditingExpense(null) }}>
        <form onSubmit={editingExpense ? handleEditExpense : handleAddExpense}>
          <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Title" name="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              <TextField label="Amount" name="price" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
              <FormControl fullWidth>
                <InputLabel id="cat-label">Category</InputLabel>
                <Select labelId="cat-label" label="Category" name="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Date" name="date" type="date" InputLabelProps={{ shrink: true }} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setExpenseOpen(false); setEditingExpense(null) }}>Cancel</Button>
            <Button type="submit">{editingExpense ? 'Save' : 'Add Expense'}</Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
  )
}

