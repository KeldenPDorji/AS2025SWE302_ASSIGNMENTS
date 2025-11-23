import React from 'react';
import { shallow, mount } from 'enzyme';
import { Editor } from './Editor';
import ListErrors from './ListErrors';

// Mock the unwrapped Editor component
const EditorUnwrapped = Editor;

describe('Editor Component', () => {
  let props;

  beforeEach(() => {
    props = {
      title: '',
      description: '',
      body: '',
      tagInput: '',
      tagList: [],
      errors: null,
      inProgress: false,
      articleSlug: null,
      onAddTag: jest.fn(),
      onLoad: jest.fn(),
      onRemoveTag: jest.fn(),
      onSubmit: jest.fn(),
      onUnload: jest.fn(),
      onUpdateField: jest.fn(),
      match: { params: {} }
    };
  });

  describe('Form Field Rendering', () => {
    it('should render all form fields', () => {
      const wrapper = shallow(<Editor {...props} />);
      expect(wrapper.find('input[placeholder="Article Title"]')).toHaveLength(1);
      expect(wrapper.find('input[placeholder="What\'s this article about?"]')).toHaveLength(1);
      expect(wrapper.find('textarea[placeholder="Write your article (in markdown)"]')).toHaveLength(1);
      expect(wrapper.find('input[placeholder="Enter tags"]')).toHaveLength(1);
    });

    it('should render title input with correct value', () => {
      props.title = 'Test Article Title';
      const wrapper = shallow(<Editor {...props} />);
      const titleInput = wrapper.find('input[placeholder="Article Title"]');
      expect(titleInput.prop('value')).toBe('Test Article Title');
    });

    it('should render description input with correct value', () => {
      props.description = 'Test description';
      const wrapper = shallow(<Editor {...props} />);
      const descInput = wrapper.find('input[placeholder="What\'s this article about?"]');
      expect(descInput.prop('value')).toBe('Test description');
    });

    it('should render body textarea with correct value', () => {
      props.body = 'Test article body';
      const wrapper = shallow(<Editor {...props} />);
      const bodyTextarea = wrapper.find('textarea');
      expect(bodyTextarea.prop('value')).toBe('Test article body');
    });

    it('should render tag input with correct value', () => {
      props.tagInput = 'test-tag';
      const wrapper = shallow(<Editor {...props} />);
      const tagInput = wrapper.find('input[placeholder="Enter tags"]');
      expect(tagInput.prop('value')).toBe('test-tag');
    });

    it('should render submit button', () => {
      const wrapper = shallow(<Editor {...props} />);
      const button = wrapper.find('button[type="button"]');
      expect(button.text()).toBe('Publish Article');
    });
  });

  describe('Form Field Updates', () => {
    it('should call onUpdateField when title changes', () => {
      const wrapper = shallow(<Editor {...props} />);
      const titleInput = wrapper.find('input[placeholder="Article Title"]');
      titleInput.simulate('change', { target: { value: 'New Title' } });
      expect(props.onUpdateField).toHaveBeenCalledWith('title', 'New Title');
    });

    it('should call onUpdateField when description changes', () => {
      const wrapper = shallow(<Editor {...props} />);
      const descInput = wrapper.find('input[placeholder="What\'s this article about?"]');
      descInput.simulate('change', { target: { value: 'New Description' } });
      expect(props.onUpdateField).toHaveBeenCalledWith('description', 'New Description');
    });

    it('should call onUpdateField when body changes', () => {
      const wrapper = shallow(<Editor {...props} />);
      const bodyTextarea = wrapper.find('textarea');
      bodyTextarea.simulate('change', { target: { value: 'New Body' } });
      expect(props.onUpdateField).toHaveBeenCalledWith('body', 'New Body');
    });

    it('should call onUpdateField when tag input changes', () => {
      const wrapper = shallow(<Editor {...props} />);
      const tagInput = wrapper.find('input[placeholder="Enter tags"]');
      tagInput.simulate('change', { target: { value: 'new-tag' } });
      expect(props.onUpdateField).toHaveBeenCalledWith('tagInput', 'new-tag');
    });
  });

  describe('Tag Input Functionality', () => {
    it('should add tag when Enter key is pressed', () => {
      const wrapper = shallow(<Editor {...props} />);
      const tagInput = wrapper.find('input[placeholder="Enter tags"]');
      const event = { keyCode: 13, preventDefault: jest.fn() };
      tagInput.simulate('keyUp', event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.onAddTag).toHaveBeenCalled();
    });

    it('should not add tag for other keys', () => {
      const wrapper = shallow(<Editor {...props} />);
      const tagInput = wrapper.find('input[placeholder="Enter tags"]');
      const event = { keyCode: 65, preventDefault: jest.fn() }; // 'A' key
      tagInput.simulate('keyUp', event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(props.onAddTag).not.toHaveBeenCalled();
    });

    it('should render tag list when tags exist', () => {
      props.tagList = ['react', 'javascript', 'testing'];
      const wrapper = shallow(<Editor {...props} />);
      const tags = wrapper.find('.tag-default.tag-pill');
      expect(tags).toHaveLength(3);
    });

    it('should display correct tag names', () => {
      props.tagList = ['react', 'javascript'];
      const wrapper = shallow(<Editor {...props} />);
      const tags = wrapper.find('.tag-default.tag-pill');
      expect(tags.at(0).text()).toContain('react');
      expect(tags.at(1).text()).toContain('javascript');
    });

    it('should call onRemoveTag when close icon is clicked', () => {
      props.tagList = ['react', 'javascript'];
      const wrapper = shallow(<Editor {...props} />);
      const removeIcon = wrapper.find('.ion-close-round').at(0);
      removeIcon.simulate('click');
      expect(props.onRemoveTag).toHaveBeenCalledWith('react');
    });

    it('should render empty tag list when no tags', () => {
      props.tagList = [];
      const wrapper = shallow(<Editor {...props} />);
      const tags = wrapper.find('.tag-default.tag-pill');
      expect(tags).toHaveLength(0);
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit when submit button is clicked', () => {
      props.title = 'Test Title';
      props.description = 'Test Description';
      props.body = 'Test Body';
      props.tagList = ['test'];
      const wrapper = shallow(<Editor {...props} />);
      const button = wrapper.find('button[type="button"]');
      const event = { preventDefault: jest.fn() };
      button.simulate('click', event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.onSubmit).toHaveBeenCalled();
    });

    it('should disable submit button when inProgress is true', () => {
      props.inProgress = true;
      const wrapper = shallow(<Editor {...props} />);
      const button = wrapper.find('button[type="button"]');
      expect(button.prop('disabled')).toBe(true);
    });

    it('should enable submit button when inProgress is false', () => {
      props.inProgress = false;
      const wrapper = shallow(<Editor {...props} />);
      const button = wrapper.find('button[type="button"]');
      expect(button.prop('disabled')).toBe(false);
    });
  });

  describe('Validation Errors', () => {
    it('should render ListErrors component', () => {
      const wrapper = shallow(<Editor {...props} />);
      expect(wrapper.find(ListErrors)).toHaveLength(1);
    });

    it('should pass errors prop to ListErrors', () => {
      props.errors = { title: ['cannot be blank'] };
      const wrapper = shallow(<Editor {...props} />);
      const listErrors = wrapper.find(ListErrors);
      expect(listErrors.prop('errors')).toEqual({ title: ['cannot be blank'] });
    });

    it('should render ListErrors with null errors', () => {
      props.errors = null;
      const wrapper = shallow(<Editor {...props} />);
      const listErrors = wrapper.find(ListErrors);
      expect(listErrors.prop('errors')).toBe(null);
    });
  });

  describe('Component Lifecycle', () => {
    it('should call onLoad on mount when no slug', () => {
      props.match = { params: {} };
      shallow(<Editor {...props} />);
      expect(props.onLoad).toHaveBeenCalledWith(null);
    });

    it('should call onUnload on unmount', () => {
      const wrapper = shallow(<Editor {...props} />);
      wrapper.unmount();
      expect(props.onUnload).toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    it('should recognize edit mode when articleSlug is present', () => {
      props.articleSlug = 'test-article-slug';
      props.title = 'Existing Article';
      const wrapper = shallow(<Editor {...props} />);
      const titleInput = wrapper.find('input[placeholder="Article Title"]');
      expect(titleInput.prop('value')).toBe('Existing Article');
    });

    it('should show correct button text in edit mode', () => {
      props.articleSlug = 'test-article-slug';
      const wrapper = shallow(<Editor {...props} />);
      const button = wrapper.find('button[type="button"]');
      expect(button.text()).toBe('Publish Article');
    });
  });
});
