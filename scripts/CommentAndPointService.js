if (localStorage.length > 0) {
  window.onload = loadPoints()
}
dragPoints()
document.addEventListener('click', singleClickListener)
document.addEventListener('dblclick', doubleClickListener)

function singleClickListener (event) {
  var deleteButton = document.getElementById('deleteComment')
  var editButton = document.getElementById('editComment')
  var submitButton = document.getElementById('submitComment')
  var targetTag = event.target.localName

  if (targetTag !== 'textarea' && targetTag !== 'form' && targetTag !== 'button' && targetTag !== 'a' && event.target.className !== 'points') {
    deleteButton.style.display = 'none'
    editButton.style.display = 'none'
    submitButton.style.display = 'inline'
    modifyCommentForm(event.clientX, event.clientY, 'block', true)
  } else if (event.target === editButton) {
    editComment(event)
  } else if (event.target === submitButton) {
    addComment(event)
  } else if (event.target === deleteButton) {
    deleteComment(event)
  }
}

function doubleClickListener (event) {
  if (event.target.className === 'points') {
    loadComments(event)
  }
  if (event.target.id === 'commentForm' || event.target.id === 'commentInput') {
    modifyCommentForm(0, 0, 'none', true)
  }
}

function dragMoveListener (event) {
  var target = event.target
  modifyCommentForm(0, 0, 'none')
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  // translate the element
  target.style.webkitTransform =
  target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

function addComment (event) {
  var textArea = document.getElementById('commentInput').value
  var form = document.getElementById('commentForm')
  var count = Number(localStorage.getItem('count'))

  form.style.display = 'none'
  if (count === null) {
    localStorage.setItem('count', 1)
  } else {
    count += 1
    localStorage.setItem('count', count)
  }
  var commentId = 'comment' + count
  var comment = {
    commentId: commentId,
    x: form.style.left,
    y: form.style.top,
    value: textArea
  }

  localStorage.setItem('comment' + count, JSON.stringify(comment))
  createPoint(commentId, form.style.left, form.style.top)
  form.reset()
}

function loadPoints () {
  var count = Number(localStorage.getItem('count'))
  if (count > 0) {
    for (var i = 0; i < localStorage.length; i++) {
      var element = JSON.parse(localStorage.getItem(localStorage.key(i)))
      if (count !== element) {
        createPoint(element.commentId, element.x, element.y)
      }
    }
  }
}

function dragPoints (event) {
  interact('.points')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
        var commentId = event.target.id
        var point = document.getElementById(commentId)
        var cordinates = point.getBoundingClientRect()
        var comment = JSON.parse(localStorage.getItem(commentId))
        comment.x = cordinates.x
        comment.y = cordinates.y
        localStorage.setItem(commentId, JSON.stringify(comment))
      }
    })
}

function loadComments (event) {
  var commentId = event.target.id
  var comment = JSON.parse(localStorage.getItem(commentId))
  modifyCommentForm(event.clientX, event.clientY, 'block')
  document.getElementById('commentInput').value = comment.value
  document.getElementById('commentId').value = commentId
  var deleteButton = document.getElementById('deleteComment')
  var editButton = document.getElementById('editComment')
  var submitButton = document.getElementById('submitComment')
  deleteButton.style.display = 'inline'
  editButton.style.display = 'inline'
  submitButton.style.display = 'none'
}

function editComment (event) {
  var textArea = document.getElementById('commentInput').value
  var commentId = document.getElementById('commentId').value
  var comment = JSON.parse(localStorage.getItem(commentId))
  console.log(commentId)
  comment.value = textArea
  localStorage.setItem(commentId, JSON.stringify(comment))
  modifyCommentForm(0, 0, 'none')
}

function deleteComment (event) {
  console.log('delete')
  var commentId = document.getElementById('commentId').value
  var point = document.getElementById(commentId)
  localStorage.removeItem(commentId)
  point.remove()
  modifyCommentForm(0, 0, 'none', true)
}

function modifyCommentForm (x, y, display, reset) {
  const form = document.getElementById('commentForm')
  form.style.left = x
  form.style.top = y
  form.style.display = display
  if (reset === true) {
    form.reset()
  }
}

function createPoint (id, x, y) {
  var newPoint = document.createElement('div')
  newPoint.className = 'points'
  newPoint.id = id
  newPoint.style.left = x
  newPoint.style.top = y
  document.body.appendChild(newPoint)
}
