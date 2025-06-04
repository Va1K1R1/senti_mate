import React, { useState } from 'react';
import Modal from '../component/Modal';
import Button from '../component/Button';

/**
 * Example component demonstrating how to use the Modal component
 * 
 * This example shows different ways to use the Modal component:
 * 1. Basic modal with title and content
 * 2. Modal with custom actions
 * 3. Modal with different sizes
 * 4. Modal without close button
 */
const ModalExample = () => {
  // State for controlling the visibility of different modals
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isNoCloseModalOpen, setIsNoCloseModalOpen] = useState(false);

  // Handler for opening the basic modal
  const openBasicModal = () => setIsBasicModalOpen(true);
  // Handler for closing the basic modal
  const closeBasicModal = () => setIsBasicModalOpen(false);

  // Handler for opening the actions modal
  const openActionsModal = () => setIsActionsModalOpen(true);
  // Handler for closing the actions modal
  const closeActionsModal = () => setIsActionsModalOpen(false);

  // Handler for opening the size modal
  const openSizeModal = () => setIsSizeModalOpen(true);
  // Handler for closing the size modal
  const closeSizeModal = () => setIsSizeModalOpen(false);

  // Handler for opening the no close button modal
  const openNoCloseModal = () => setIsNoCloseModalOpen(true);
  // Handler for closing the no close button modal
  const closeNoCloseModal = () => setIsNoCloseModalOpen(false);

  // Example action handlers
  const handleSave = () => {
    alert('Save action triggered');
    closeActionsModal();
  };

  const handleDelete = () => {
    alert('Delete action triggered');
    closeActionsModal();
  };

  return (
    <div className="modal-examples">
      <h1>Modal Component Examples</h1>
      
      {/* Basic Modal Example */}
      <section className="example-section">
        <h2>Basic Modal</h2>
        <p>A simple modal with a title and content.</p>
        <Button text="Open Basic Modal" onClick={openBasicModal} type="primary" />
        
        <Modal
          isOpen={isBasicModalOpen}
          onClose={closeBasicModal}
          title="Basic Modal Example"
        >
          <p>This is a basic modal with a title and content.</p>
          <p>Click outside or press ESC to close.</p>
        </Modal>
      </section>
      
      {/* Modal with Actions Example */}
      <section className="example-section">
        <h2>Modal with Actions</h2>
        <p>A modal with custom action buttons in the footer.</p>
        <Button text="Open Modal with Actions" onClick={openActionsModal} type="primary" />
        
        <Modal
          isOpen={isActionsModalOpen}
          onClose={closeActionsModal}
          title="Modal with Actions"
          actions={[
            { text: 'Cancel', onClick: closeActionsModal, type: 'secondary' },
            { text: 'Delete', onClick: handleDelete, type: 'danger' },
            { text: 'Save', onClick: handleSave, type: 'primary' }
          ]}
        >
          <p>This modal has custom action buttons in the footer.</p>
          <p>Try clicking on the different buttons to see what happens.</p>
        </Modal>
      </section>
      
      {/* Modal with Different Sizes Example */}
      <section className="example-section">
        <h2>Modal Sizes</h2>
        <p>Modals can have different sizes: small, medium (default), or large.</p>
        <Button text="Open Size Modal" onClick={openSizeModal} type="primary" />
        
        <Modal
          isOpen={isSizeModalOpen}
          onClose={closeSizeModal}
          title="Modal Sizes"
          size="large"
        >
          <p>This is a large modal. The Modal component supports three sizes:</p>
          <ul>
            <li><strong>small</strong>: 400px max-width</li>
            <li><strong>medium</strong>: 600px max-width (default)</li>
            <li><strong>large</strong>: 800px max-width</li>
          </ul>
          <p>Choose the appropriate size based on your content.</p>
        </Modal>
      </section>
      
      {/* Modal without Close Button Example */}
      <section className="example-section">
        <h2>Modal without Close Button</h2>
        <p>A modal that can only be closed by clicking a specific button.</p>
        <Button text="Open No Close Button Modal" onClick={openNoCloseModal} type="primary" />
        
        <Modal
          isOpen={isNoCloseModalOpen}
          onClose={closeNoCloseModal}
          title="No Close Button Modal"
          showCloseButton={false}
          actions={[
            { text: 'Close Modal', onClick: closeNoCloseModal, type: 'primary' }
          ]}
        >
          <p>This modal doesn't have a close button in the header.</p>
          <p>It can only be closed by clicking the button below or by pressing ESC.</p>
        </Modal>
      </section>
    </div>
  );
};

export default ModalExample;