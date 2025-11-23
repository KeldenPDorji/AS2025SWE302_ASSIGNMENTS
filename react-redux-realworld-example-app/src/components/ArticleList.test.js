import React from 'react';
import { shallow } from 'enzyme';
import ArticleList from './ArticleList';
import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';

describe('ArticleList Component', () => {
  // Test 1: Rendering with empty articles array
  it('should render "No articles" message when articles array is empty', () => {
    const wrapper = shallow(<ArticleList articles={[]} />);
    expect(wrapper.find('.article-preview').text()).toBe('No articles are here... yet.');
  });

  // Test 2: Rendering loading state
  it('should render loading message when articles is null', () => {
    const wrapper = shallow(<ArticleList articles={null} />);
    expect(wrapper.find('.article-preview').text()).toBe('Loading...');
  });

  // Test 3: Rendering loading state when articles is undefined
  it('should render loading message when articles is undefined', () => {
    const wrapper = shallow(<ArticleList />);
    expect(wrapper.find('.article-preview').text()).toBe('Loading...');
  });

  // Test 4: Rendering with multiple articles
  it('should render multiple ArticlePreview components when articles exist', () => {
    const mockArticles = [
      {
        slug: 'test-article-1',
        title: 'Test Article 1',
        description: 'Description 1',
        author: { username: 'user1' },
        tagList: [],
        favorited: false,
        favoritesCount: 0,
        createdAt: '2025-01-01'
      },
      {
        slug: 'test-article-2',
        title: 'Test Article 2',
        description: 'Description 2',
        author: { username: 'user2' },
        tagList: [],
        favorited: false,
        favoritesCount: 0,
        createdAt: '2025-01-02'
      }
    ];

    const wrapper = shallow(<ArticleList articles={mockArticles} />);
    expect(wrapper.find(ArticlePreview)).toHaveLength(2);
  });

  // Test 5: Verify article keys are set correctly
  it('should use article slug as key for each ArticlePreview', () => {
    const mockArticles = [
      {
        slug: 'unique-slug-123',
        title: 'Test Article',
        description: 'Description',
        author: { username: 'user1' },
        tagList: [],
        favorited: false,
        favoritesCount: 0,
        createdAt: '2025-01-01'
      }
    ];

    const wrapper = shallow(<ArticleList articles={mockArticles} />);
    const articlePreview = wrapper.find(ArticlePreview).first();
    expect(articlePreview.key()).toBe('unique-slug-123');
  });

  // Test 6: Rendering pagination component
  it('should render ListPagination component when articles exist', () => {
    const mockArticles = [
      {
        slug: 'test-article',
        title: 'Test Article',
        description: 'Description',
        author: { username: 'user1' },
        tagList: [],
        favorited: false,
        favoritesCount: 0,
        createdAt: '2025-01-01'
      }
    ];

    const wrapper = shallow(
      <ArticleList 
        articles={mockArticles}
        pager={() => {}}
        articlesCount={10}
        currentPage={0}
      />
    );
    expect(wrapper.find(ListPagination)).toHaveLength(1);
  });

  // Test 7: Passing correct props to pagination
  it('should pass correct props to ListPagination', () => {
    const mockArticles = [{
      slug: 'test',
      title: 'Test',
      description: 'Desc',
      author: { username: 'user1' },
      tagList: [],
      favorited: false,
      favoritesCount: 0,
      createdAt: '2025-01-01'
    }];
    const mockPager = () => {};
    const mockArticlesCount = 25;
    const mockCurrentPage = 2;

    const wrapper = shallow(
      <ArticleList 
        articles={mockArticles}
        pager={mockPager}
        articlesCount={mockArticlesCount}
        currentPage={mockCurrentPage}
      />
    );

    const pagination = wrapper.find(ListPagination);
    expect(pagination.prop('pager')).toBe(mockPager);
    expect(pagination.prop('articlesCount')).toBe(mockArticlesCount);
    expect(pagination.prop('currentPage')).toBe(mockCurrentPage);
  });
});
