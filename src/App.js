import { useState } from 'react';

const initialItems = [
	{ id: 1, description: 'Passports', quantity: 2, packed: false },
	{ id: 2, description: 'Socks', quantity: 12, packed: true },
	{ id: 3, description: 'Charger', quantity: 1, packed: false },
];

export default function App() {
	const [items, setItems] = useState([]);
	const numItems = items.length;
	function handleAddItems(item) {
		setItems((items) => [...items, item]);
	}

	function handleDeleteItem(id) {
		setItems((items) => items.filter((item) => item.id !== id));
	}

	function handleToggleItem(id) {
		setItems((items) =>
			items.map((item) =>
				item.id === id ? { ...item, packed: !item.packed } : item
			)
		);
	}

	function handleClearList() {
		const confirmed = window.confirm(
			'Are you sure you want to delet all items'
		);

		if (confirmed) setItems([]);
	}

	return (
		<div className='app'>
			<Logo />
			<Form onAddItems={handleAddItems} />
			<PackingList
				items={items}
				onDeleteItem={handleDeleteItem}
				onToggleItem={handleToggleItem}
				onClearList={handleClearList}
			/>
			<Stats items={items} />
		</div>
	);
}

function Logo() {
	return <h1> 🎄 Far Away 🎁</h1>;
}

function Form({ onAddItems }) {
	const [description, setDescription] = useState('');
	const [number, setNumber] = useState(1);

	function handleSubmit(e) {
		e.preventDefault();

		if (!description) return;

		const newItem = { description, number, packed: false, id: Date.now() };
		console.log(newItem);

		onAddItems(newItem);

		setDescription('');
		setNumber(1);
	}

	return (
		<form className='add-form' onSubmit={handleSubmit}>
			<h3>What Do You Need For Your 😍Trip</h3>
			<select
				value={number}
				onChange={(e) => setNumber(Number(e.target.value))}
			>
				{Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
					<option value={num} key={num}>
						{num}
					</option>
				))}
			</select>
			<input
				type='text'
				placeholder='Item....'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<button>Add</button>
		</form>
	);
}

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
	const [sortBy, setSortBy] = useState('packed');

	let sortedItems;
	if (sortBy === 'input') sortedItems = items;
	if (sortBy === 'description')
		sortedItems = items
			.slice()
			.sort((a, b) => a.description.localeCompare(b.description));

	if (sortBy === 'packed')
		sortedItems = items
			.slice()
			.sort((a, b) => Number(a.packed) - Number(b.packed));
	return (
		<div className='list'>
			<ul>
				{sortedItems.map((item) => (
					<Item
						item={item}
						onDeleteItem={onDeleteItem}
						onToggleItem={onToggleItem}
						key={item.id}
					/>
				))}
			</ul>
			<div className='actions'>
				<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
					<option value='input'>Sort By Input order</option>
					<option value='description'>Sort By Description</option>
					<option value='packed'>Sort By Packed Status</option>
				</select>
				<button onClick={onClearList}> Clear List</button>
			</div>
		</div>
	);
}

function Item({ item, onDeleteItem, onToggleItem }) {
	return (
		<li>
			<input
				type='checkbox'
				value={item.packed}
				onChange={() => onToggleItem(item.id)}
			/>{' '}
			<span style={item.packed ? { textDecoration: 'line-through' } : {}}>
				{item.quantity} {item.description}
			</span>
			<button onClick={() => onDeleteItem(item.id)}>✌</button>
		</li>
	);
}

function Stats({ items }) {
	if (!items.length)
		return (
			<p className='stats'>
				<em>Start Adding Some Items To Your List</em>
			</p>
		);
	const numItems = items.length;
	const numPacked = items.filter((item) => item.packed).length;
	const percentage = Math.round((numPacked / numItems) * 100);

	return (
		<footer className='stats'>
			<em>
				{percentage === 100
					? 'You Got Have Everythong Ready To Go ✔'
					: `You Have ${numItems} items on your list and you already packed
				${numPacked} (${percentage}%)`}
			</em>
		</footer>
	);
}
