
import { useState } from 'react';
import './FoodForm.css';

function FoodForm({ onSave, editingFood, onCancelEdit }) {
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <>
      {successMessage && (
        <p className="food-form-success" role="status">
          {successMessage}
        </p>
      )}

      <FoodFormFields
        key={editingFood?.id ?? 'new'}
        onSave={onSave}
        editingFood={editingFood}
        onCancelEdit={onCancelEdit}
        setSuccessMessage={setSuccessMessage}
      />
    </>
  );
}

function FoodFormFields({
  onSave,
  editingFood,
  onCancelEdit,
  setSuccessMessage,
}) {
  const [name, setName] = useState(editingFood?.name ?? '');

  const [description, setDescription] = useState(
    editingFood?.description ?? ''
  );

  const [price, setPrice] = useState(
    editingFood?.price.replace('$', '') ?? ''
  );

  const [image, setImage] = useState(editingFood?.image ?? '');

  const [imagePreview, setImagePreview] = useState(
    editingFood?.image ?? ''
  );

  const [category, setCategory] = useState(
    editingFood?.category ?? 'Pizza'
  );

  const [imageError, setImageError] = useState('');

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Please select an image smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setImagePreview(reader.result);
      }
    };

    reader.onerror = () => {
      setImageError('Unable to read this image. Please try another.');
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!image) {
      setImageError('Please upload a food image.');
      return;
    }

    const food = {
      name: name.trim(),
      description: description.trim(),
      price: `$${price}`,
      image,
      category,
    };

    if (editingFood) {
      food.id = editingFood.id;
    }

    onSave(food);

    setSuccessMessage(
      editingFood
        ? 'Food item updated successfully!'
        : 'Food item saved successfully!'
    );

    if (!editingFood) {
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setImagePreview('');
      setCategory('Pizza');
      setImageError('');

      const fileInput = document.getElementById('food-image');

      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h2 className="food-form-title">
        {editingFood ? 'Edit Food Item' : 'Add New Food'}
      </h2>

      <p className="food-form-description">
        Enter the details below to add or update a menu item.
      </p>

      <div className="food-form-group">
        <label className="food-form-label" htmlFor="food-name">
          Food Name
        </label>

        <input
          className="food-form-input"
          id="food-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Margherita Pizza"
          required
        />
      </div>

      <div className="food-form-group">
        <label
          className="food-form-label"
          htmlFor="food-description"
        >
          Description
        </label>

        <textarea
          className="food-form-textarea"
          id="food-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the ingredients or taste of this food"
          required
        />
      </div>

      <div className="food-form-group">
        <label className="food-form-label" htmlFor="food-price">
          Price ($)
        </label>

        <input
          className="food-form-input"
          id="food-price"
          type="number"
          min="0.10"
          step="any"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="e.g. 12.50"
          required
        />
      </div>

      <div className="food-form-group">
        <label className="food-form-label" htmlFor="food-image">
          Upload Food Image
        </label>

        <input
          className="food-form-input"
          id="food-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required={!image}
        />

        <small className="food-form-help">
          Choose an image from your computer. Maximum size: 2 MB.
        </small>

        {imageError && (
          <p className="food-form-error" role="alert">
            {imageError}
          </p>
        )}

        {imagePreview && (
          <div className="food-form-preview">
            <p className="food-form-help">Image Preview</p>

            <img
              src={imagePreview}
              alt="Food preview"
            />
          </div>
        )}
      </div>

      <div className="food-form-group">
        <label className="food-form-label" htmlFor="food-category">
          Category
        </label>

        <select
          className="food-form-select"
          id="food-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Pizza">Pizza</option>
          <option value="Burgers">Burgers</option>
          <option value="Chicken">Chicken</option>
          <option value="Salads">Salads</option>
        </select>
      </div>

      <div className="food-form-actions">
        <button className="food-form-submit" type="submit">
          {editingFood ? 'Update Food' : 'Save Food Item'}
        </button>

        {editingFood && (
          <button
            className="food-form-cancel"
            type="button"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default FoodForm;
