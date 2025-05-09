# Frontend Architecture Documentation

## C4 Model Documentation

### Level 1: System Context

```mermaid
graph TD
    U[User] -->|Interacts with| F[Frontend Application]
    F -->|API Requests| B[Backend Services]
    F -->|Authentication| B
```

#### Key Elements
- **Users**: End-users accessing the application through web browsers
- **Frontend Application**: Vue.js-based SPA
- **Backend Services**: REST API endpoints

### Level 2: Container

```mermaid
graph TD
    subgraph "Frontend Application"
        UI[Vue.js UI Layer]
        Router[Vue Router]
        State[Pinia State Management]
        API[API Layer]
    end
    
    UI -->|Navigation| Router
    UI -->|State Updates| State
    UI -->|Data Requests| API
    API -->|HTTP Requests| Backend
```

#### Components
1. **Vue.js UI Layer**
   - Technology: Vue 3
   - Primary interface for user interaction
   - Renders components and views

2. **Vue Router**
   - Manages navigation and route guards
   - Handles authentication-based routing
   - Routes:
     - `/login`: Public access
     - `/`: Protected dashboard
     - `/historique`: Protected history view

3. **Pinia State Management**
   - Persistent state management
   - Uses `pinia-plugin-persistedstate`
   - Manages authentication state

4. **API Layer**
   - Handles backend communication
   - Manages authentication tokens

### Level 3: Component

```mermaid
graph TD
    subgraph "Views"
        LV[LoginView]
        DV[DashboardView]
        HV[HistoriqueView]
    end
    
    subgraph "State Stores"
        AS[Auth Store]
    end
    
    subgraph "Core Components"
        App[App.vue]
        Router[Router]
    end
    
    App -->|Routes to| LV
    App -->|Routes to| DV
    App -->|Routes to| HV
    LV -->|Updates| AS
    DV -->|Reads| AS
    HV -->|Reads| AS
```

#### Key Components
1. **Views**
   - `LoginView.vue`: Authentication interface
   - `DashboardView.vue`: Main application dashboard
   - `HistoriqueView.vue`: Historical data view

2. **State Management**
   - `authStore.js`: Manages authentication state and tokens

3. **Core Components**
   - `App.vue`: Root component
   - `Router`: Navigation management with auth guards

### Level 4: Code

```mermaid
graph TD
    subgraph "Application Bootstrap"
        main.js -->|Initializes| App.vue
        main.js -->|Configures| Pinia
        main.js -->|Mounts| Router
    end
    
    subgraph "Authentication Flow"
        Login -->|Stores Token| LocalStorage
        Router -->|Checks Token| LocalStorage
        Router -->|Guards Routes| Views
    end
```

#### Implementation Details

1. **Entry Point (`main.js`)**
   ```javascript
   // Initializes Vue app with Pinia and Router
   const app = createApp(App);
   app.use(router).use(pinia).mount('#app');
   ```

2. **Router Configuration**
   ```javascript
   // Route definitions with auth guards
   const routes = [
     { path: '/login', component: LoginView },
     { path: '/', component: DashboardView, meta: { requiresAuth: true } },
     { path: '/historique', component: HistoriqueView, meta: { requiresAuth: true } }
   ];
   ```

3. **Authentication Store**
   - Manages user session
   - Handles token persistence
   - Controls authentication state

## Additional Technical Details

### State Management
The application uses Pinia for state management with the following features:
- Persistent state through `pinia-plugin-persistedstate`
- Centralized authentication state in `authStore.js`
- Token-based authentication flow

### Routing
Vue Router implementation includes:
- Authentication guards for protected routes
- Automatic redirection for unauthenticated users
- Persistent navigation state

### Component Structure
The application follows a hierarchical component structure:
- Views for main page components
- Reusable UI components
- Core layout components

### Security
- Token-based authentication
- Protected route guards
- Secure state management
- HTTP-only cookies for sensitive data 