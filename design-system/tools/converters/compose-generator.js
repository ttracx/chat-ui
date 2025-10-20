#!/usr/bin/env node

/**
 * Jetpack Compose Component Generator
 * Converts design system components to Jetpack Compose code
 */

const fs = require('fs');
const path = require('path');

class ComposeGenerator {
  constructor() {
    this.imports = new Set([
      'androidx.compose.foundation.layout.*',
      'androidx.compose.material3.*',
      'androidx.compose.runtime.*',
      'androidx.compose.ui.*',
      'androidx.compose.ui.unit.*',
      'androidx.compose.ui.graphics.*',
      'androidx.compose.ui.tooling.preview.*'
    ]);
  }

  /**
   * Generate Compose component from specification
   */
  generateComponent(spec) {
    const { name, type, props, children } = spec;
    
    switch (type) {
      case 'screen':
        return this.generateScreen(spec);
      case 'button':
        return this.generateButton(props);
      case 'input':
        return this.generateTextField(props);
      case 'card':
        return this.generateCard(props, children);
      case 'list':
        return this.generateList(props, children);
      case 'navigation':
        return this.generateNavigation(props, children);
      default:
        return this.generateContainer(props, children);
    }
  }

  /**
   * Generate complete Compose screen
   */
  generateScreen(spec) {
    const { name, layout, components } = spec;
    const screenName = this.toPascalCase(name);
    
    return `
@Composable
fun ${screenName}Screen(
    navController: NavController? = null,
    viewModel: ${screenName}ViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("${spec.title || name}") },
                navigationIcon = {
                    IconButton(onClick = { navController?.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        ${this.generateLayout(layout, components, 'paddingValues')}
    }
}

// ViewModel
@HiltViewModel
class ${screenName}ViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _uiState = MutableStateFlow(${screenName}UiState())
    val uiState: StateFlow<${screenName}UiState> = _uiState.asStateFlow()
    
    data class ${screenName}UiState(
        val isLoading: Boolean = false,
        val errorMessage: String? = null,
        val data: List<Any> = emptyList()
    )
    
    fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            try {
                // Load data
                _uiState.update { it.copy(isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { 
                    it.copy(isLoading = false, errorMessage = e.message) 
                }
            }
        }
    }
}

// Preview
@Preview(showBackground = true)
@Composable
fun ${screenName}ScreenPreview() {
    DSTheme {
        ${screenName}Screen()
    }
}`;
  }

  /**
   * Generate layout structure
   */
  generateLayout(layout, components, padding = null) {
    const paddingModifier = padding ? `.padding(${padding})` : '';
    
    switch (layout) {
      case 'vertical':
        return `
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()${paddingModifier},
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(1) {
                ${components.map(c => this.generateComponent(c)).join('\n                ')}
            }
        }`;
      
      case 'horizontal':
        return `
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()${paddingModifier},
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(1) {
                ${components.map(c => this.generateComponent(c)).join('\n                ')}
            }
        }`;
      
      case 'grid':
        return `
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier
                .fillMaxSize()${paddingModifier},
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(1) {
                ${components.map(c => this.generateComponent(c)).join('\n                ')}
            }
        }`;
      
      default:
        return `
        Box(
            modifier = Modifier
                .fillMaxSize()${paddingModifier}
        ) {
            ${components.map(c => this.generateComponent(c)).join('\n            ')}
        }`;
    }
  }

  /**
   * Generate Button component
   */
  generateButton(props) {
    const { text, variant, size, action, icon, fullWidth } = props;
    
    let modifiers = [];
    if (fullWidth) {
      modifiers.push('fillMaxWidth()');
    }
    
    const modifierChain = modifiers.length > 0 
      ? `\n    modifier = Modifier.${modifiers.join('.')},` 
      : '';
    
    let buttonContent = '';
    if (icon && text) {
      buttonContent = `
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.Default.${icon},
            contentDescription = null,
            modifier = Modifier.size(20.dp)
        )
        Text("${text}")
    }`;
    } else if (text) {
      buttonContent = `Text("${text}")`;
    }
    
    return `
DSButton(
    text = "${text || 'Button'}",${modifierChain}
    variant = DSButtonVariant.${(variant || 'PRIMARY').toUpperCase()},
    size = DSButtonSize.${(size || 'MEDIUM').toUpperCase()},
    onClick = { ${action || '// Handle click'} }
) {
    ${buttonContent}
}`;
  }

  /**
   * Generate TextField component
   */
  generateTextField(props) {
    const { placeholder, type, label, value } = props;
    const stateVar = value || 'textState';
    
    let fieldCode = '';
    
    if (type === 'password') {
      fieldCode = `
var passwordVisible by remember { mutableStateOf(false) }

OutlinedTextField(
    value = ${stateVar},
    onValueChange = { ${stateVar} = it },
    label = { Text("${label || placeholder || ''}") },
    placeholder = { Text("${placeholder || ''}") },
    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
    trailingIcon = {
        IconButton(onClick = { passwordVisible = !passwordVisible }) {
            Icon(
                imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                contentDescription = if (passwordVisible) "Hide password" else "Show password"
            )
        }
    },
    modifier = Modifier.fillMaxWidth()
)`;
    } else {
      fieldCode = `
OutlinedTextField(
    value = ${stateVar},
    onValueChange = { ${stateVar} = it },
    label = { Text("${label || placeholder || ''}") },
    placeholder = { Text("${placeholder || ''}") },
    modifier = Modifier.fillMaxWidth()
)`;
    }
    
    return fieldCode;
  }

  /**
   * Generate Card component
   */
  generateCard(props, children = []) {
    const { title, subtitle, image, variant, clickable } = props;
    
    let cardModifier = 'Modifier.fillMaxWidth()';
    if (clickable) {
      cardModifier += '.clickable { /* Handle click */ }';
    }
    
    let cardContent = `
        Column(
            modifier = Modifier.padding(16.dp)
        ) {`;
    
    if (image) {
      cardContent = `
        Column {
            Image(
                painter = painterResource(id = R.drawable.${image}),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentScale = ContentScale.Crop
            )` + cardContent;
    }
    
    if (title) {
      cardContent += `
            Text(
                text = "${title}",
                style = MaterialTheme.typography.headlineSmall
            )`;
    }
    
    if (subtitle) {
      cardContent += `
            Text(
                text = "${subtitle}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )`;
    }
    
    if (children.length > 0) {
      cardContent += `
            Spacer(modifier = Modifier.height(8.dp))
            ${children.map(c => this.generateComponent(c)).join('\n            ')}`;
    }
    
    cardContent += `
        }`;
    
    const elevation = variant === 'elevated' ? 'CardDefaults.cardElevation(defaultElevation = 4.dp)' : 'CardDefaults.cardElevation(defaultElevation = 0.dp)';
    
    return `
Card(
    modifier = ${cardModifier},
    elevation = ${elevation}
) {${cardContent}
}`;
  }

  /**
   * Generate List component
   */
  generateList(props, children = []) {
    const { items, style } = props;
    
    if (!items || items.length === 0) {
      return `
LazyColumn {
    items(0) {
        // Empty list
    }
}`;
    }
    
    return `
LazyColumn(
    modifier = Modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    items(${items.length}) { index ->
        ${this.generateListItem(items[0])}
    }
}`;
  }

  generateListItem(item) {
    return `
ListItem(
    headlineContent = { Text("${item.title || ''}") },
    ${item.subtitle ? `supportingContent = { Text("${item.subtitle}") },` : ''}
    ${item.icon ? `leadingContent = { 
        Icon(
            Icons.Default.${item.icon},
            contentDescription = null
        ) 
    },` : ''}
    ${item.trailing ? `trailingContent = { 
        ${this.generateTrailing(item.trailing)}
    },` : ''}
    modifier = Modifier.clickable { /* Handle click */ }
)`;
  }

  generateTrailing(trailing) {
    switch (trailing.type) {
      case 'switch':
        return `Switch(checked = false, onCheckedChange = {})`;
      case 'text':
        return `Text("${trailing.value}")`;
      case 'icon':
        return `Icon(Icons.Default.ChevronRight, contentDescription = null)`;
      default:
        return '';
    }
  }

  /**
   * Generate Navigation component
   */
  generateNavigation(props, children = []) {
    const { type, items } = props;
    
    if (type === 'bottom') {
      return this.generateBottomNavigation(items);
    }
    
    return this.generateNavigationRail(items);
  }

  generateBottomNavigation(items) {
    return `
NavigationBar {
    ${items.map((item, index) => `
    NavigationBarItem(
        icon = { Icon(Icons.Default.${item.icon}, contentDescription = null) },
        label = { Text("${item.label}") },
        selected = selectedItem == ${index},
        onClick = { selectedItem = ${index} }
    )`).join('')}
}`;
  }

  generateNavigationRail(items) {
    return `
NavigationRail {
    ${items.map((item, index) => `
    NavigationRailItem(
        icon = { Icon(Icons.Default.${item.icon}, contentDescription = null) },
        label = { Text("${item.label}") },
        selected = selectedItem == ${index},
        onClick = { selectedItem = ${index} }
    )`).join('')}
}`;
  }

  /**
   * Generate generic container
   */
  generateContainer(props, children = []) {
    const { type, spacing, padding } = props;
    
    if (type === 'horizontal') {
      return `
Row(
    modifier = Modifier${padding ? `.padding(${padding}.dp)` : ''},
    horizontalArrangement = Arrangement.spacedBy(${spacing || 8}.dp)
) {
    ${children.map(c => this.generateComponent(c)).join('\n    ')}
}`;
    }
    
    return `
Column(
    modifier = Modifier${padding ? `.padding(${padding}.dp)` : ''},
    verticalArrangement = Arrangement.spacedBy(${spacing || 8}.dp)
) {
    ${children.map(c => this.generateComponent(c)).join('\n    ')}
}`;
  }

  /**
   * Generate complete Kotlin file
   */
  generateFile(screens, packageName = 'com.example.app') {
    const imports = Array.from(this.imports).join('\n');
    const screenCode = screens.map(s => this.generateComponent(s)).join('\n\n');
    
    return `package ${packageName}

${imports}
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Generated Jetpack Compose Screens
 * Created by Design System Generator
 */

${screenCode}

// Helper Extensions
fun Modifier.conditional(
    condition: Boolean,
    modifier: Modifier.() -> Modifier
): Modifier {
    return if (condition) {
        then(modifier(Modifier))
    } else {
        this
    }
}`;
  }

  /**
   * Utility function to convert to PascalCase
   */
  toPascalCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * Convert JSON specification to Compose
   */
  convertFromJSON(jsonPath, outputPath, packageName = 'com.example.app') {
    try {
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      const specification = JSON.parse(jsonContent);
      
      const composeCode = this.generateFile(specification.screens, packageName);
      
      fs.writeFileSync(outputPath, composeCode);
      console.log(`✅ Jetpack Compose code generated successfully: ${outputPath}`);
      
      return composeCode;
    } catch (error) {
      console.error(`❌ Error generating Compose code: ${error.message}`);
      throw error;
    }
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node compose-generator.js <input.json> <output.kt> [package.name]');
    process.exit(1);
  }
  
  const generator = new ComposeGenerator();
  generator.convertFromJSON(args[0], args[1], args[2]);
}

module.exports = ComposeGenerator;