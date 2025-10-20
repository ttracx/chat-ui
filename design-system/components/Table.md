# Table Component

Structured data display with sorting, filtering, and pagination.

## Anatomy

### Table Container
```css
width: 100%
overflow: auto /* Horizontal scroll on small screens */
border: 1px solid neutral.200
border-radius: borderRadius.lg (8px)
background: neutral.0
```

### Table Header
```css
background: neutral.50
border-bottom: 2px solid neutral.300
font: textStyles.label (14px, medium, uppercase)
color: neutral.700
padding: spacing.3 spacing.4 (12px 16px)
text-align: left
```

### Table Row
```css
border-bottom: 1px solid neutral.200
transition: background duration.fast
```

### Table Cell
```css
padding: spacing.4 (16px)
color: neutral.900
font: textStyles.body (16px)
vertical-align: middle
```

## States

### Table Row - Normal
```css
background: neutral.0
```

### Table Row - Hover
```css
background: neutral.50
cursor: pointer /* If clickable */
```

### Table Row - Selected
```css
background: primary.50
border-left: 4px solid primary.500
```

### Table Row - Disabled
```css
opacity: 0.5
cursor: not-allowed
background: neutral.100
```

### Table Header - Sortable
```css
cursor: pointer
user-select: none

/* Sort icon */
.sort-icon {
  display: inline-block
  margin-left: spacing.2
  color: neutral.400
  
  /* Active sort */
  &.active {
    color: primary.500
  }
}
```

## Features

### Sorting
- **Single column**: Click header to sort
- **Ascending**: ▲ icon
- **Descending**: ▼ icon
- **Unsorted**: ⇅ icon
- **Indicator**: Active column highlighted

### Filtering
- **Column filters**: Input/dropdown per column
- **Global search**: Search all columns
- **Clear filters**: Button to reset all filters

### Pagination
- **Position**: Bottom of table
- **Items per page**: Dropdown (10, 25, 50, 100)
- **Navigation**: First, Previous, Numbers, Next, Last
- **Info**: "Showing 1-10 of 100 items"

### Selection
- **Checkbox**: First column
- **Select all**: Header checkbox
- **Bulk actions**: Toolbar appears when rows selected
- **Count**: "3 items selected"

### Row Actions
- **Inline**: Actions in last column (Edit, Delete)
- **Context menu**: Right-click for more actions
- **Hover**: Actions appear on row hover

## Responsive Behavior

### Desktop (>1024px)
- Full table layout
- All columns visible
- Horizontal scroll if needed

### Tablet (768px - 1024px)
- Important columns visible
- Others collapsible/hidden
- Horizontal scroll enabled

### Mobile (<768px)
- **Card layout**: Each row becomes a card
- **Stacked**: Data arranged vertically
- **Expandable**: Tap to show all details

## Accessibility

### ARIA Attributes
```html
<table role="table" aria-label="User data table">
  <thead>
    <tr role="row">
      <th role="columnheader" aria-sort="ascending">
        Name
        <button aria-label="Sort by name ascending">
          <span aria-hidden="true">▲</span>
        </button>
      </th>
      <th role="columnheader">Email</th>
      <th role="columnheader">Role</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <td role="cell">John Doe</td>
      <td role="cell">john@example.com</td>
      <td role="cell">Admin</td>
    </tr>
  </tbody>
</table>

<!-- For screen readers -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  Sorted by name, ascending order. Showing 10 of 100 results.
</div>
```

### Keyboard Navigation
- **Tab**: Navigate to table
- **Arrow keys**: Navigate cells (when focused)
- **Enter**: Activate cell/row action
- **Space**: Toggle row selection (checkbox)
- **Shift+Click**: Select range

### Requirements
- Semantic table markup (`<table>`, `<thead>`, `<tbody>`)
- Column headers properly labeled
- Sort state announced to screen readers
- Pagination controls keyboard accessible
- Focus indicators visible

## Code Examples

### Web (Svelte)
```svelte
<script>
  import { Table, TableHeader, TableRow, TableCell } from '$lib/components/design-system';
  
  export let data = [];
  
  let sortColumn = 'name';
  let sortDirection = 'asc';
  let selectedRows = new Set();
  let currentPage = 1;
  let itemsPerPage = 10;
  
  $: sortedData = sortData(data, sortColumn, sortDirection);
  $: paginatedData = paginate(sortedData, currentPage, itemsPerPage);
  
  function handleSort(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }
  
  function toggleRow(id) {
    if (selectedRows.has(id)) {
      selectedRows.delete(id);
    } else {
      selectedRows.add(id);
    }
    selectedRows = selectedRows;
  }
</script>

<Table>
  <TableHeader>
    <TableRow>
      <th>
        <input
          type="checkbox"
          on:change={toggleAllRows}
          checked={selectedRows.size === data.length}
        />
      </th>
      <th on:click={() => handleSort('name')}>
        Name
        {#if sortColumn === 'name'}
          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </th>
      <th on:click={() => handleSort('email')}>Email</th>
      <th>Actions</th>
    </TableRow>
  </TableHeader>
  
  <tbody>
    {#each paginatedData as row}
      <TableRow selected={selectedRows.has(row.id)}>
        <TableCell>
          <input
            type="checkbox"
            checked={selectedRows.has(row.id)}
            on:change={() => toggleRow(row.id)}
          />
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>
          <button on:click={() => editRow(row)}>Edit</button>
          <button on:click={() => deleteRow(row)}>Delete</button>
        </TableCell>
      </TableRow>
    {/each}
  </tbody>
</Table>

<Pagination
  {currentPage}
  {itemsPerPage}
  totalItems={data.length}
  on:pageChange={(e) => currentPage = e.detail}
/>
```

### iOS (SwiftUI)
```swift
struct DSTable<T: Identifiable, Content: View>: View {
    let data: [T]
    let columns: [TableColumn]
    let content: (T) -> Content
    
    @State private var sortColumn: String?
    @State private var sortAscending = true
    @State private var selectedRows = Set<T.ID>()
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack(spacing: 0) {
                ForEach(columns) { column in
                    Button(action: {
                        if sortColumn == column.key {
                            sortAscending.toggle()
                        } else {
                            sortColumn = column.key
                            sortAscending = true
                        }
                    }) {
                        HStack {
                            Text(column.title)
                                .font(.caption)
                                .fontWeight(.medium)
                                .foregroundColor(Color("Neutral700"))
                            
                            if sortColumn == column.key {
                                Image(systemName: sortAscending ? "arrow.up" : "arrow.down")
                                    .font(.caption2)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                    }
                }
            }
            .background(Color("Neutral50"))
            .border(Color("Neutral300"), width: 1)
            
            // Rows
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(sortedData) { item in
                        content(item)
                            .background(
                                selectedRows.contains(item.id) ?
                                Color("Primary50") : Color.white
                            )
                            .onTapGesture {
                                toggleSelection(item.id)
                            }
                    }
                }
            }
        }
        .border(Color("Neutral200"), width: 1)
        .cornerRadius(8)
    }
}
```

### Android (Jetpack Compose)
```kotlin
@Composable
fun <T> DSTable(
    data: List<T>,
    columns: List<TableColumn<T>>,
    modifier: Modifier = Modifier,
    onRowClick: ((T) -> Unit)? = null
) {
    var sortColumn by remember { mutableStateOf<String?>(null) }
    var sortAscending by remember { mutableStateOf(true) }
    val selectedRows = remember { mutableStateSetOf<Int>() }
    
    Column(
        modifier = modifier
            .border(1.dp, Neutral200, RoundedCornerShape(8.dp))
            .clip(RoundedCornerShape(8.dp))
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Neutral50)
                .border(0.dp, 0.dp, 2.dp, 0.dp, Neutral300)
        ) {
            columns.forEach { column ->
                Box(
                    modifier = Modifier
                        .weight(column.weight)
                        .clickable {
                            if (sortColumn == column.key) {
                                sortAscending = !sortAscending
                            } else {
                                sortColumn = column.key
                                sortAscending = true
                            }
                        }
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = column.title.uppercase(),
                            style = MaterialTheme.typography.labelMedium,
                            color = Neutral700
                        )
                        if (sortColumn == column.key) {
                            Icon(
                                imageVector = if (sortAscending) 
                                    Icons.Default.ArrowUpward 
                                else 
                                    Icons.Default.ArrowDownward,
                                contentDescription = null,
                                modifier = Modifier.size(12.dp),
                                tint = Primary500
                            )
                        }
                    }
                }
            }
        }
        
        // Rows
        LazyColumn {
            itemsIndexed(sortedData) { index, item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            if (index in selectedRows) Primary50 else Color.White
                        )
                        .clickable { onRowClick?.invoke(item) }
                        .border(0.dp, 0.dp, 1.dp, 0.dp, Neutral200)
                        .padding(horizontal = 16.dp, vertical = 16.dp)
                ) {
                    columns.forEach { column ->
                        Box(modifier = Modifier.weight(column.weight)) {
                            column.cell(item)
                        }
                    }
                }
            }
        }
    }
}
```

## Best Practices

### Do ✓
- Show most important data first
- Provide clear column headers
- Enable sorting on key columns
- Use pagination for large datasets (>50 rows)
- Provide filtering/search for findability
- Make row actions discoverable
- Use fixed header for long tables
- Provide loading states
- Show empty state when no data

### Don't ✗
- Show all columns on mobile (use card view)
- Use tables for small datasets (use list)
- Hide important data in hidden columns
- Make entire table unscrollable
- Use too many nested columns
- Omit loading indicators for async data
- Make tables without any data controls

## Advanced Features

### Expandable Rows
```javascript
<TableRow>
  <TableCell>
    <button onClick={toggleExpand}>
      {expanded ? '▼' : '▶'}
    </button>
    {row.name}
  </TableCell>
</TableRow>
{#if expanded}
  <TableRow class="expanded-content">
    <TableCell colspan="4">
      <!-- Detailed content -->
    </TableCell>
  </TableRow>
{/if}
```

### Column Resizing
- Drag handle on column border
- Double-click to auto-fit content
- Minimum column width: 100px

### Column Reordering
- Drag and drop column headers
- Save preference to local storage

### Inline Editing
- Double-click cell to edit
- Tab to next cell
- Enter to save, Escape to cancel

## Related Components
- **List**: Simpler data display
- **DataGrid**: Advanced table with virtual scrolling
- **Card**: Alternative for mobile/simple data
- **Pagination**: Companion component
