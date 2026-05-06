import type { TopicNode } from "@/data/types";

export const componentDesign: TopicNode = {
  id: "react-component-design",
  title: "Component Design Principles",
  iconName: "PenTool",
  theory:
    "React gives you complete freedom in how to design components, which is exactly why most large apps end up with a mess of 800-line god components. Senior engineers apply deliberate principles to keep components small, focused, and composable: Single Responsibility, the right level of abstraction, composition over configuration, and knowing when to split vs. when to merge.",
  theoryDetail: {
    keyConcepts: [
      "Single Responsibility Principle: a component should do one thing — render a product card, not manage product data, animations, analytics, and error states simultaneously",
      "Composition over Configuration: accept `children` and slot props instead of prop-drilling every display option through a growing list of boolean props",
      "Appropriate abstraction: extract a component only when the same JSX appears 3+ times or when you can give the extract a meaningful name",
      "Container/Presentational split: separate data-fetching/logic components from pure display components — this makes testing trivial",
      "Co-location: keep a component's CSS, tests, and closely related sub-components in the same folder — don't split across the project by file type",
    ],
    whyItMatters:
      "A 50-line component can be understood in 30 seconds. A 500-line component requires an hour of archaeology. Component design decisions compound over years — the same codebase maintained by 10 engineers for 2 years grows 10x larger, and every poor design decision echoes through that growth. Experienced engineers design for future readers, not just current functionality.",
    commonPitfalls: [
      "The 'boolean prop explosion': isLarge, isOutlined, isDisabled, isPrimary, isLoading, isFullWidth — use a variant string instead",
      "Premature extraction: creating an abstraction for code that only appears once adds indirection without benefit",
      "Mixing data-fetching with rendering in the same component — untestable, unreusable, hard to reason about",
      "Deeply nested conditional rendering: if/else trees 5 levels deep signal the need for component extraction or a state machine",
      "Accepting 15+ props — this is a design smell. The component is doing too much. Split it or use the compound component pattern",
    ],
    examples: [
      {
        title: "The Boolean Prop Explosion Anti-pattern",
        description:
          "Every new visual variant adds another boolean. Consumers have to guess which combinations are valid. Replace with a discriminated variant prop.",
        code: `// ❌ Anti-pattern: 6 booleans = 64 possible combinations, most invalid
function Button({
  isLarge,
  isSmall,
  isPrimary,
  isOutlined,
  isDestructive,
  isLoading,
  isFullWidth,
  isDisabled,
  children,
  onClick,
}) { /* ... */ }

// Usage is ambiguous — what does isPrimary + isOutlined + isDestructive even look like?
<Button isPrimary isOutlined>Submit</Button>

// ✅ Better: a typed variant prop communicates intent and constraints
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'primary', size = 'md', isLoading, isFullWidth, children, onClick }: ButtonProps) {
  const classes = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'text-gray-900 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={\`\${classes[variant]} \${isFullWidth ? 'w-full' : ''}\`}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

// Usage is clear and unambiguous
<Button variant="destructive" size="sm">Delete</Button>`,
        language: "tsx",
      },
      {
        title: "Container / Presentational Split",
        description:
          "Separate the 'what data do I show' (Container) from the 'how do I display it' (Presentational). Presentational components are trivial to test, reuse, and design in Storybook.",
        code: `// ── Presentational: pure UI, no data fetching, no side effects ──
// Easy to render in Storybook, easy to test, easy to reuse
interface UserCardProps {
  name: string;
  email: string;
  avatarUrl: string;
  isOnline: boolean;
  onMessage: () => void;
}

function UserCard({ name, email, avatarUrl, isOnline, onMessage }: UserCardProps) {
  return (
    <article className="card">
      <img src={avatarUrl} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{email}</p>
        <span className={isOnline ? 'online' : 'offline'}>
          {isOnline ? '● Online' : '○ Offline'}
        </span>
      </div>
      <button onClick={onMessage}>Message</button>
    </article>
  );
}

// ── Container: data fetching, state, side effects ──
// Handles all the "messy" logic, passes clean props down
function UserCardContainer({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: (recipientId: string) => createConversation(recipientId),
    onSuccess: (conversation) => router.push(\`/messages/\${conversation.id}\`),
  });

  if (isLoading) return <UserCardSkeleton />;
  if (error) return <ErrorState message="Could not load user" />;

  return (
    <UserCard
      name={user.name}
      email={user.email}
      avatarUrl={user.avatarUrl}
      isOnline={user.presence === 'online'}
      onMessage={() => sendMessage(userId)}
    />
  );
}`,
        language: "tsx",
      },
      {
        title: "Composition over Configuration",
        description:
          "Instead of accepting every display option as a prop, accept children and named slots. Consumers control the rendering; your component controls the layout and behavior.",
        code: `// ❌ Configuration hell — every UI variation needs a new prop
<DataTable
  title="Users"
  showSearch={true}
  showExport={true}
  headerActions={[{ label: 'Add User', onClick: openModal }]}
  emptyStateMessage="No users yet"
  emptyStateIcon={<UserIcon />}
  onRowClick={handleRowClick}
  isLoading={loading}
  columns={columns}
  data={users}
/>

// ✅ Composition — consumers build their own header, empty state, footer
<DataTable data={users} isLoading={loading} onRowClick={handleRowClick} columns={columns}>
  <DataTable.Header>
    <h2>Users</h2>
    <div className="flex gap-2">
      <SearchInput onChange={setSearch} />
      <ExportButton data={users} filename="users.csv" />
      <Button onClick={openModal}>Add User</Button>
    </div>
  </DataTable.Header>

  <DataTable.EmptyState>
    <UserIcon />
    <p>No users yet</p>
    <Button onClick={openModal}>Invite your first user</Button>
  </DataTable.EmptyState>

  <DataTable.Footer>
    <Pagination total={total} page={page} onChange={setPage} />
  </DataTable.Footer>
</DataTable>

// The DataTable implementation uses children via slots:
function DataTable({ children, data, isLoading, columns, onRowClick }) {
  const header = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === DataTable.Header
  );
  // ... render header, body (data rows), and footer in order
}
DataTable.Header = ({ children }) => <>{children}</>;
DataTable.EmptyState = ({ children }) => <>{children}</>;
DataTable.Footer = ({ children }) => <>{children}</>;`,
        language: "tsx",
      },
    ],
  },
};
