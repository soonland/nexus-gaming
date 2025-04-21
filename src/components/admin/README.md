# Composants Admin

Ce dossier contient les composants réutilisables pour l'interface
d'administration.

## Structure

```
admin/
  ├── common/              # Composants communs
  │   ├── AdminActions    # Actions standards (créer, etc.)
  │   ├── AdminDataTable  # Table de données avec tri
  │   ├── AdminFilters    # Filtres de recherche
  │   └── AdminList       # Liste avec états (loading, empty, error)
  └── layout/             # Composants de mise en page
      └── AdminPageLayout # Layout standard des pages admin
```

## Utilisation

Exemple de page admin standard :

```tsx
const AdminSectionPage = () => {
  return (
    <AdminPageLayout
      title='Titre de la section'
      actions={
        <AdminActions
          createHref='/admin/section/new'
          createLabel='Ajouter...'
        />
      }
    >
      <AdminFilters searchPlaceholder='Rechercher...' onSearch={handleSearch} />
      <AdminList
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage='Aucun élément trouvé'
      >
        {/* Contenu de la liste */}
      </AdminList>
    </AdminPageLayout>
  );
};
```

## Composants

### AdminDataTable

Table de données avec fonctionnalités de tri.

```tsx
<AdminDataTable<T>
  columns={[
    {
      field: 'name', // Champ de l'objet à afficher
      headerName: 'Nom', // Libellé de la colonne
      sortable: true, // Colonne triable
      width: '200px', // Largeur optionnelle
      render: value => '...', // Rendu personnalisé
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: '120px',
      render: (_, row) => (
        <AdminActionButtons
          editHref={`/admin/items/${row.id}/edit`}
          onDelete={() => handleDelete(row.id)}
          isDeleting={isDeleting}
        />
      ),
    },
  ]}
  rows={items} // Données à afficher
  sortField='name' // Champ de tri actif
  sortOrder='asc' // Direction du tri
  onSort={handleSort} // Callback de tri
/>
```

### AdminActionButtons

Boutons d'actions standards pour les lignes de table.

```tsx
<AdminActionButtons
  editHref='/admin/items/123/edit' // Lien d'édition
  onDelete={() => {}} // Callback de suppression
  isDeleting={false} // État de suppression
  tooltips={{
    // Tooltips optionnels
    edit: 'Modifier',
    delete: 'Supprimer',
  }}
/>
```

### AdminDeleteDialog

Dialogue de confirmation pour la suppression.

```tsx
<AdminDeleteDialog
  isOpen={dialogOpen} // Visibilité du dialogue
  isLoading={isDeleting} // État de chargement
  title="Supprimer l'élément" // Titre du dialogue
  message='Confirmation...' // Message de confirmation
  onClose={() => {}} // Fermeture du dialogue
  onConfirm={() => {}} // Confirmation de suppression
/>
```

### AdminPageLayout

Layout principal avec titre et zone d'actions.

```tsx
<AdminPageLayout title='Titre' actions={<AdminActions />}>
  {children}
</AdminPageLayout>
```

### AdminActions

Boutons d'actions standards.

```tsx
<AdminActions
  createHref='/admin/new' // URL pour le bouton créer
  createLabel='Ajouter' // Texte du bouton
  extra={<Button>Extra</Button>} // Actions supplémentaires
/>
```

### AdminFilters

Filtres de recherche.

```tsx
<AdminFilters
  onSearch={handleSearch} // Callback de recherche
  searchPlaceholder='Rechercher' // Placeholder
  extra={<OtherFilters />} // Filtres additionnels
/>
```

### AdminList

Conteneur de liste avec gestion des états.

```tsx
<AdminList
  isLoading={isLoading} // État chargement
  error={error} // État erreur
  isEmpty={items.length === 0} // État vide
  emptyMessage='Aucun élément' // Message si vide
  emptyAction={<Button />} // Action si vide
>
  {/* Contenu de la liste */}
</AdminList>
```
