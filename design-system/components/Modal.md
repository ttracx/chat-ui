# Modal Component

Dialog overlay for focused user interactions.

## Variants

### Default Modal
- **Size**: Medium (600px max-width)
- **Backdrop**: `overlay.medium` (rgba(0,0,0,0.7))
- **Animation**: Fade in + scale up

### Alert Modal
- **Purpose**: Important notifications requiring action
- **Icon**: Alert/warning icon
- **Actions**: Confirm/Cancel

### Confirmation Modal
- **Purpose**: Verify destructive actions
- **Icon**: Question or warning icon
- **Actions**: Confirm (destructive) / Cancel

### Full-Screen Modal
- **Purpose**: Complex forms, multi-step processes
- **Size**: 100vw x 100vh
- **Animation**: Slide up from bottom

## Sizes

### Small
- **Max-width**: 400px
- **Usage**: Simple confirmations, alerts

### Medium (Default)
- **Max-width**: 600px
- **Usage**: Standard forms, details

### Large
- **Max-width**: 800px
- **Usage**: Complex content, detailed forms

### Extra Large
- **Max-width**: 1000px
- **Usage**: Media galleries, data tables

### Full-Screen
- **Width**: 100vw
- **Height**: 100vh
- **Usage**: Mobile-first, complex workflows

## Anatomy

### Modal Container
```css
position: fixed
top: 50%
left: 50%
transform: translate(-50%, -50%)
z-index: zIndex.modal (1050)
max-height: 90vh
overflow: auto
```

### Backdrop
```css
position: fixed
top: 0
left: 0
right: 0
bottom: 0
background: transparent.overlay.medium (rgba(0,0,0,0.7))
z-index: zIndex.modalBackdrop (1040)
backdrop-filter: blur(blur.sm)
```

### Modal Dialog
```css
background: neutral.0
border-radius: borderRadius.xl (12px)
shadow: shadows.2xl
padding: 0 /* Content sections have padding */
```

### Modal Header
- **Padding**: `spacing.6` (24px)
- **Border-bottom**: `1px solid neutral.200`
- **Title**: `textStyles.h3`
- **Close button**: Top-right (X icon)

### Modal Body
- **Padding**: `spacing.6` (24px)
- **Max-height**: Scrollable if content overflows
- **Content**: Forms, text, images, etc.

### Modal Footer
- **Padding**: `spacing.6` (24px)
- **Border-top**: `1px solid neutral.200`
- **Alignment**: Right-aligned buttons
- **Actions**: Cancel (secondary) + Primary action

## States

### Opening
```css
animation: fadeIn duration.moderate easing.easeOut,
           scaleUp duration.moderate easing.easeOut

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes scaleUp {
  from { transform: translate(-50%, -50%) scale(0.95) }
  to { transform: translate(-50%, -50%) scale(1) }
}
```

### Open
```css
opacity: 1
transform: translate(-50%, -50%) scale(1)
/* Body scroll locked */
/* Focus trapped within modal */
```

### Closing
```css
animation: fadeOut duration.fast easing.easeIn,
           scaleDown duration.fast easing.easeIn
```

### Closed
```css
display: none
/* Body scroll restored */
/* Focus returned to trigger element */
```

## Accessibility

### ARIA Attributes
```html
<!-- Modal backdrop -->
<div
  class="modal-backdrop"
  role="presentation"
  aria-hidden="true"
  onclick="closeModal()"
></div>

<!-- Modal dialog -->
<div
  class="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <div class="modal-header">
    <h2 id="modal-title">Modal Title</h2>
    <button
      type="button"
      aria-label="Close modal"
      onclick="closeModal()"
    >
      <span aria-hidden="true">×</span>
    </button>
  </div>
  
  <div class="modal-body" id="modal-description">
    <p>Modal content goes here...</p>
  </div>
  
  <div class="modal-footer">
    <button type="button">Cancel</button>
    <button type="button">Confirm</button>
  </div>
</div>
```

### Focus Management
1. **On Open**:
   - Focus first focusable element (usually close button or first input)
   - Trap focus within modal
   - Prevent body scroll

2. **While Open**:
   - Tab/Shift+Tab cycles through modal elements only
   - Focus ring visible on all interactive elements

3. **On Close**:
   - Return focus to trigger element
   - Restore body scroll
   - Remove focus trap

### Keyboard Navigation
- **Tab**: Next focusable element
- **Shift+Tab**: Previous focusable element
- **Escape**: Close modal
- **Enter**: Activate focused button/link

### Requirements
- Descriptive title (aria-labelledby)
- Body text description (aria-describedby)
- Focus trap implementation
- Escape key to close
- Backdrop click to close (with confirmation for forms)
- Minimum color contrast 4.5:1

## Behavior

### Opening Modal
```javascript
function openModal() {
  // 1. Show modal
  modal.classList.add('open');
  
  // 2. Lock body scroll
  document.body.style.overflow = 'hidden';
  
  // 3. Focus first element
  const firstFocusable = modal.querySelector('button, input, textarea, select, a');
  firstFocusable?.focus();
  
  // 4. Setup focus trap
  setupFocusTrap(modal);
  
  // 5. Add event listeners
  modal.addEventListener('click', handleBackdropClick);
  document.addEventListener('keydown', handleEscapeKey);
}
```

### Closing Modal
```javascript
function closeModal() {
  // 1. Hide modal
  modal.classList.remove('open');
  
  // 2. Restore body scroll
  document.body.style.overflow = '';
  
  // 3. Return focus to trigger
  triggerElement?.focus();
  
  // 4. Remove event listeners
  modal.removeEventListener('click', handleBackdropClick);
  document.removeEventListener('keydown', handleEscapeKey);
  
  // 5. Clean up focus trap
  destroyFocusTrap();
}
```

## Code Examples

### Web (Svelte)
```svelte
<script>
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '$lib/components/design-system';
  import { createEventDispatcher } from 'svelte';
  
  export let open = false;
  export let title = '';
  export let confirmText = 'Confirm';
  export let cancelText = 'Cancel';
  
  const dispatch = createEventDispatcher();
  
  function handleConfirm() {
    dispatch('confirm');
    open = false;
  }
  
  function handleCancel() {
    dispatch('cancel');
    open = false;
  }
</script>

<Modal bind:open size="medium" on:close={handleCancel}>
  <ModalHeader {title} on:close={handleCancel} />
  
  <ModalBody>
    <slot />
  </ModalBody>
  
  <ModalFooter>
    <button type="button" variant="secondary" on:click={handleCancel}>
      {cancelText}
    </button>
    <button type="button" variant="primary" on:click={handleConfirm}>
      {confirmText}
    </button>
  </ModalFooter>
</Modal>
```

### iOS (SwiftUI)
```swift
struct DSModal<Content: View>: View {
    @Binding var isPresented: Bool
    let title: String
    let content: Content
    var onConfirm: () -> Void
    var onCancel: () -> Void
    
    init(
        isPresented: Binding<Bool>,
        title: String,
        @ViewBuilder content: () -> Content,
        onConfirm: @escaping () -> Void,
        onCancel: @escaping () -> Void
    ) {
        self._isPresented = isPresented
        self.title = title
        self.content = content()
        self.onConfirm = onConfirm
        self.onCancel = onCancel
    }
    
    var body: some View {
        ZStack {
            // Backdrop
            Color.black.opacity(0.7)
                .ignoresSafeArea()
                .onTapGesture {
                    isPresented = false
                    onCancel()
                }
            
            // Modal
            VStack(spacing: 0) {
                // Header
                HStack {
                    Text(title)
                        .font(.title3)
                        .fontWeight(.semibold)
                    
                    Spacer()
                    
                    Button(action: {
                        isPresented = false
                        onCancel()
                    }) {
                        Image(systemName: "xmark")
                            .foregroundColor(Color("Neutral500"))
                    }
                }
                .padding(24)
                .background(Color.white)
                
                Divider()
                
                // Body
                ScrollView {
                    content
                        .padding(24)
                }
                
                Divider()
                
                // Footer
                HStack(spacing: 12) {
                    Button("Cancel") {
                        isPresented = false
                        onCancel()
                    }
                    .buttonStyle(SecondaryButtonStyle())
                    
                    Button("Confirm") {
                        onConfirm()
                        isPresented = false
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }
                .padding(24)
            }
            .frame(maxWidth: 600)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(radius: 20)
        }
        .opacity(isPresented ? 1 : 0)
        .scaleEffect(isPresented ? 1 : 0.95)
        .animation(.easeOut(duration: 0.3), value: isPresented)
    }
}
```

### Android (Jetpack Compose)
```kotlin
@Composable
fun DSModal(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    title: String,
    confirmText: String = "Confirm",
    cancelText: String = "Cancel",
    onConfirm: () -> Unit,
    content: @Composable () -> Unit
) {
    if (isOpen) {
        Dialog(
            onDismissRequest = onDismiss,
            properties = DialogProperties(
                dismissOnBackPress = true,
                dismissOnClickOutside = true,
                usePlatformDefaultWidth = false
            )
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .wrapContentHeight(),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(20.dp)
            ) {
                Column {
                    // Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = title,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                        IconButton(onClick = onDismiss) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close"
                            )
                        }
                    }
                    
                    Divider()
                    
                    // Body
                    Box(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .padding(24.dp)
                    ) {
                        content()
                    }
                    
                    Divider()
                    
                    // Footer
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.End,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        TextButton(onClick = onDismiss) {
                            Text(cancelText)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Button(onClick = {
                            onConfirm()
                            onDismiss()
                        }) {
                            Text(confirmText)
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
- Use sparingly for critical interruptions
- Provide clear title and description
- Always offer a way to close (X button, Cancel, Escape)
- Focus appropriate element on open
- Return focus on close
- Prevent body scroll when open
- Use for focused tasks that require completion

### Don't ✗
- Stack modals on top of each other
- Use for non-essential information (use Toast instead)
- Make close button hard to find
- Auto-close without user action (unless timeout clearly shown)
- Use for long-form content (use separate page)
- Trap users without obvious exit

## Modal Types

### Confirmation Modal
```javascript
showConfirmation({
  title: 'Delete Item?',
  message: 'This action cannot be undone.',
  confirmText: 'Delete',
  confirmVariant: 'destructive',
  onConfirm: () => deleteItem()
});
```

### Form Modal
```javascript
showFormModal({
  title: 'Add New Item',
  form: FormComponent,
  onSubmit: (data) => saveItem(data)
});
```

### Alert Modal
```javascript
showAlert({
  title: 'Success!',
  message: 'Your changes have been saved.',
  icon: 'success',
  confirmText: 'OK'
});
```

## Related Components
- **Drawer**: Slide-in panel from edge
- **Toast**: Temporary notification (non-blocking)
- **Popover**: Contextual overlay
- **Dialog**: Alternative term for modal
