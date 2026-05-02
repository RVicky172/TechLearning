import type { TopicNode } from "@/data/types";

export const reactRouter: TopicNode = {
  id: "react-router-dom",
  title: "React Router",
  iconName: "Route",
  link: "https://reactrouter.com/en/main",
  theory:
    "React Router is the standard client-side routing library for React SPAs. It maps URL paths to components, manages browser history, and enables navigation without full page reloads. v6 introduced a flat <Routes> API, typed params via useParams, and v6.4+ added data loading with loaders and actions directly in route definitions.",
  theoryDetail: {
    keyConcepts: [
      "<BrowserRouter> (or createBrowserRouter) wraps the app and provides routing context via the History API",
      "<Routes> and <Route path element> replace the old v5 <Switch> — only the first matching Route renders",
      "useNavigate() returns a navigate function for programmatic navigation; useParams() reads dynamic :param segments",
      "Nested routes with <Outlet /> render child routes inside a parent layout without duplication",
      "Protected routes are regular components — check auth state and redirect with <Navigate> or navigate()",
      "useSearchParams() reads and updates the URL query string (?q=foo) as reactive state",
    ],
    whyItMatters:
      "Any React SPA needs routing. React Router is used in the majority of production React applications and its patterns — nested layouts, protected routes, and data loaders — are patterns you'll encounter in every large codebase. v6.4+ data routers bring server-like loader/action patterns to the client, making it closer to the full-stack model Next.js exposes.",
    commonPitfalls: [
      "Using <a href> instead of <Link to> — <a> triggers a full page reload and loses all React state",
      "Nesting <Routes> without a trailing /* on the parent path — child routes won't match",
      "Checking auth inside the protected page component instead of a layout route — causes a flash of the protected content",
      "Forgetting to add an <Outlet /> inside a layout component — child routes render nowhere",
      "Reading params with props.match (v5 API) instead of useParams() in v6",
    ],
    examples: [
      {
        title: "Basic router setup",
        description:
          "Wrap the app in BrowserRouter, declare routes with Routes + Route. The * catch-all renders a 404.",
        code: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home }      from './pages/Home';
import { Products }  from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { NotFound }  from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/products"      element={<Products />} />
        <Route path="/products/:id"  element={<ProductDetail />} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        language: "jsx",
      },
      {
        title: "Link, NavLink, and useNavigate",
        description:
          "Use <Link> for declarative navigation. <NavLink> adds an active class automatically. useNavigate() handles programmatic redirects (after form submit, auth, etc.).",
        code: `import { Link, NavLink, useNavigate } from 'react-router-dom';

// NavLink applies className 'active' when the route matches
function Nav() {
  return (
    <nav>
      <NavLink to="/"         className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
      <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Products</NavLink>
    </nav>
  );
}

// Programmatic navigation after an async action
function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(new FormData(e.target));
    navigate('/dashboard', { replace: true }); // replace so back button skips login
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email"    type="email"    required />
      <input name="password" type="password" required />
      <button type="submit">Log in</button>
    </form>
  );
}`,
        language: "jsx",
      },
      {
        title: "Dynamic params and query strings",
        description:
          "Read :id segments with useParams. Read and update ?q=... query strings with useSearchParams — both are reactive and sync with the URL.",
        code: `import { useParams, useSearchParams, Link } from 'react-router-dom';

// Route: /products/:id
function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(\`/api/products/\${id}\`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;
  return <h1>{product.name}</h1>;
}

// Route: /products?q=shoes&sort=price
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const sort  = searchParams.get('sort') ?? 'name';

  return (
    <div>
      <input
        value={query}
        onChange={e => setSearchParams({ q: e.target.value, sort })}
        placeholder="Search..."
      />
      <select value={sort} onChange={e => setSearchParams({ q: query, sort: e.target.value })}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "Nested routes with Outlet",
        description:
          "Declare child routes inside a parent. The parent renders <Outlet /> where children appear — perfect for shared sidebars and tab layouts.",
        code: `// Route tree
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index          element={<DashboardHome />} />     {/* /dashboard */}
    <Route path="reports" element={<Reports />} />           {/* /dashboard/reports */}
    <Route path="settings" element={<Settings />} />         {/* /dashboard/settings */}
  </Route>
</Routes>

// DashboardLayout.tsx — the shared shell
import { Outlet, NavLink } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/reports">Reports</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </aside>
      <main>
        {/* Active child route renders here */}
        <Outlet />
      </main>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Protected routes",
        description:
          "Create a layout route that checks auth and redirects to /login if the user is not authenticated. All protected pages are nested inside it — no auth check logic needed in each page.",
        code: `import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Layout route — renders children or redirects
function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user)   return <Navigate to="/login" replace />;

  return <Outlet />;
}

// Route tree — all children are automatically protected
<Routes>
  <Route path="/login"    element={<Login />} />

  <Route element={<RequireAuth />}>
    <Route path="/dashboard"       element={<Dashboard />} />
    <Route path="/dashboard/profile" element={<Profile />} />
    <Route path="/admin"           element={<Admin />} />
  </Route>
</Routes>`,
        language: "jsx",
      },
      {
        title: "Data router — loaders and actions (v6.4+)",
        description:
          "Use createBrowserRouter with loader/action to co-locate fetching with the route definition. useLoaderData() reads the result with zero loading state boilerplate.",
        code: `import { createBrowserRouter, RouterProvider, useLoaderData, Form } from 'react-router-dom';

// Loader runs before the component renders — like getServerSideProps
async function productLoader({ params }) {
  const res = await fetch(\`/api/products/\${params.id}\`);
  if (!res.ok) throw new Response('Not Found', { status: 404 });
  return res.json();
}

// Action handles form submissions (POST, PUT, DELETE)
async function reviewAction({ request, params }) {
  const formData = await request.formData();
  await fetch(\`/api/products/\${params.id}/reviews\`, {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { 'Content-Type': 'application/json' },
  });
  return null; // React Router revalidates the loader after action
}

// Component reads loader data — no useEffect, no loading state
function ProductPage() {
  const product = useLoaderData();

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* Form with method="post" triggers the action */}
      <Form method="post">
        <textarea name="review" required />
        <button type="submit">Submit Review</button>
      </Form>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/products/:id',
    element: <ProductPage />,
    loader: productLoader,
    action: reviewAction,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}`,
        language: "jsx",
      },
    ],
  },
};
